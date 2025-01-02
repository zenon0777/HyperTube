import os
import time
import requests
import ffmpeg
import libtorrent as lt
from django.http import HttpResponse
from .utils import convert_mp4_to_mkv

SAVE_PATH = './_Movies'
TORRENT_FILES_PATH = '/tmp/torrent_files'

class TorrentStream:
    def __init__(self):
        os.makedirs(TORRENT_FILES_PATH, exist_ok=True)
        self.torrent_file_path = None
        self.session = lt.session()
        self.session.listen_on(6881, 6891)
        self.torrent_info = None
        self.handle = None

        self.file_path = None
        self.mkv_file_path = None
        self.file_size = None
        self.start_byte = 0
        self.end_byte = None
        self.piece_size = None

    def init_torrent_file(self, torrent_url):
        """
        Download a .torrent file from torrent_url into /tmp/torrent_files,
        unless it already exists. Store the local path in self.torrent_file_path.
        """
        if not torrent_url:
            print("====> Error: Torrent URL is not provided.")
            return

        response = requests.get(torrent_url, timeout=30)
        if response.status_code != 200:
            print(f"====> Failed to download the torrent. Status code: {response.status_code}")
            return

        file_name = torrent_url.split('/')[-1].split('.')[0]
        self.torrent_file_path = os.path.join(TORRENT_FILES_PATH, f"{file_name}.torrent")

        if not os.path.exists(self.torrent_file_path):
            with open(self.torrent_file_path, 'wb') as f:
                f.write(response.content)
            print("====> Torrent file downloaded successfully.")
        else:
            print("====> Torrent file already exists.")

    def add_torrent(self, magnet_link=None):
        """
        Add the torrent via magnet link or .torrent file, then wait for metadata.
        """
        if magnet_link:
            print(f"====> Adding torrent from magnet link: {magnet_link}")
            params = lt.parse_magnet_uri(magnet_link)
            params.save_path = SAVE_PATH
            params.storage_mode = lt.storage_mode_t.storage_mode_sparse
            self.handle = self.session.add_torrent(params)
        else:
            if not self.torrent_file_path:
                print("====> Error: No .torrent file path provided.")
                return
            print(f"====> Adding torrent from file: {self.torrent_file_path}")
            self.torrent_info = lt.torrent_info(self.torrent_file_path)
            self.handle = self.session.add_torrent({
                'ti': self.torrent_info,
                'save_path': SAVE_PATH,
                'storage_mode': lt.storage_mode_t.storage_mode_allocate
            })

        print("====> Waiting for metadata...")
        while not self.handle.status().has_metadata:
            time.sleep(0.5)
        print("====> Metadata received successfully.")

        self.torrent_info = self.handle.torrent_file()
        files = self.torrent_info.files()
        self.file_path = os.path.join(SAVE_PATH, files.file_path(0))
        self.file_size = files.file_size(0)
        self.piece_size = self.torrent_info.piece_length()

        self.handle.read_piece(0)
        print(f"====> File path: {self.file_path}")
        print(f"====> File size: {self.file_size}")
        print(f"====> Piece size: {self.piece_size}")

    def parse_chunk_range(self, vrange):
        """
        Parse the HTTP Range header and set start/end byte positions.
        """
        if not vrange:
            self.start_byte = 0
            self.end_byte = self.file_size - 1
        else:
            start, end = vrange.replace('bytes=', '').split('-')
            self.start_byte = int(start)
            if end:
                self.end_byte = int(end)
            else:
                self.end_byte = self.file_size - 1

        if self.end_byte >= self.file_size:
            self.end_byte = self.file_size - 1

        return {'start': self.start_byte, 'end': self.end_byte}

    def wait_for_piece(self, piece_index, max_wait=20, interval=0.5):
        """
        Wait until a piece is downloaded or until max_wait seconds elapse.
        """
        waited = 0
        while not self.handle.have_piece(piece_index):
            time.sleep(interval)
            waited += interval
            if waited >= max_wait:
                print(f"====> Timed out waiting for piece index: {piece_index}")
                break

    def _read_file_chunk(self, file_path, start_byte, chunk_size):
        """
        Read a chunk from file_path starting at start_byte of length chunk_size.
        """
        if not os.path.exists(file_path):
            print(f"====> Error: File does not exist at {file_path}")
            return None

        try:
            with open(file_path, 'rb') as f:
                f.seek(start_byte)
                return f.read(chunk_size)
        except OSError as e:
            print(f"====> Error reading file: {e}")
            return None

    def stream_torrent(self, vrange):
        """
        Read data from the main torrent file, waiting for the piece if necessary.
        """
        parsed_range = self.parse_chunk_range(vrange)
        start_byte = parsed_range['start']
        end_byte = parsed_range['end']

        piece_index = start_byte // self.piece_size
        print(f"====> Reading piece {piece_index} for range {start_byte}-{end_byte}")

        self.handle.read_piece(piece_index)
        self.wait_for_piece(piece_index)

        chunk_size = (end_byte - start_byte) + 1
        return self._read_file_chunk(self.file_path, start_byte, chunk_size)

    def stream_mkv(self, vrange):
        """
        Stream from the MKV file if it exists.
        """
        if not self.mkv_file_path:
            print("====> Warning: MKV file path is not set.")
            return None

        parsed_range = self.parse_chunk_range(vrange)
        start_byte = parsed_range['start']
        end_byte = parsed_range['end']

        print(f"====> Reading MKV from: {start_byte} to {end_byte}")

        chunk_size = (end_byte - start_byte) + 1
        return self._read_file_chunk(self.mkv_file_path, start_byte, chunk_size)

    def create_response(self, vrange, video_format='mp4'):
        """
        Create and return an HTTP partial content response for the specified range.
        """
        if video_format.lower() == 'mkv':
            data = self.stream_mkv(vrange)
            content_type = "video/x-matroska"
        else:
            data = self.stream_torrent(vrange)
            content_type = f"video/{video_format}"

        if not data:
            return HttpResponse(
                status=416,
                content="Requested Range Not Satisfiable"
            )

        response = HttpResponse(data, content_type=content_type, status=206)
        response['Content-Length'] = len(data)
        response['Content-Range'] = (
            f"bytes {self.start_byte}-{self.start_byte + len(data) - 1}/{self.file_size}"
        )
        response['Accept-Ranges'] = 'bytes'
        return response

    def remove_stream(self):
        """Remove this torrent handle from the session."""
        if self.handle:
            self.session.remove_torrent(self.handle)
            print("====> Removed torrent from session.")

    def convert_video_to_mkv(self):
        """
        Convert the downloaded MP4 file to MKV once fully downloaded,
        executing in a separate thread to avoid blocking.
        """
        if not self.file_path:
            print("====> Error: No file path for conversion.")
            return

        self.mkv_file_path = self.file_path.replace(".mp4", ".mkv")
        if os.path.exists(self.mkv_file_path):
            print("====> MKV already exists.")
            return

        print("====> Starting conversion to MKV...")
        try:
            while True:
                status = self.handle.status()
                print(f"====> Checking torrent status... progress: {status.progress}")
                if status.progress >= 1.0:
                    print("====> Torrent downloaded. Converting to MKV.")
                    convert_mp4_to_mkv(self.file_path, self.mkv_file_path)
                    print("====> Conversion to MKV completed.")
                    return
                time.sleep(1)
        except Exception as e:
            print(f"====> Error during conversion: {e}")

    def __str__(self):
        """String representation of this TorrentStream."""
        if self.torrent_info:
            return f"TorrentStream with file path: {self.torrent_info.files().file_path(0)}"
        return "TorrentStream with no torrent info yet."