from django.http import HttpResponse
import requests
import libtorrent as lt
import time
import os
import ffmpeg

SAVE_PATH = './_Movies'
TORRENT_FILES_PATH = '/tmp/torrent_files'


class TorrentStream:
    def __init__(self):
        if not os.path.exists("/tmp/torrent_files"):
            os.makedirs("/tmp/torrent_files")
        self.torrent_file_path = None
        self.session = lt.session()
        self.torrent_info = None
        self.handle = None
        self.session.listen_on(6881, 6891)

        self.file_path = None
        self.mkv_file_path = None
        self.file_size = None
        self.start_byte = 0
        self.end_byte = None
        self.piece_size = None

    def init_torrent_file(self, torrent_url):
        response = requests.get(torrent_url)
        self.torrent_file_path = f"{TORRENT_FILES_PATH}/{torrent_url.split('/')[-1].split('.')[0]}.torrent"

        if response.status_code == 200:
            if not os.path.exists(self.torrent_file_path):
                with open(self.torrent_file_path, 'wb') as f:
                    f.write(response.content)
                print("Torrent file downloaded successfully.")
            else:
                print("Torrent file already exists.")
        else:
            print(
                f"Failed to download the torrent. Status code: {response.status_code}")

    def add_torrent(self, magnet_link=None):
        if magnet_link:
            print(f"====> Adding torrent from magnet link: {magnet_link}")
            params = lt.parse_magnet_uri(magnet_link)
            params.save_path = SAVE_PATH
            params.storage_mode = lt.storage_mode_t.storage_mode_sparse
            self.handle = self.session.add_torrent(params)
        else:
            print(f"====> Adding torrent from file: {self.torrent_file_path}")
            self.torrent_info = lt.torrent_info(self.torrent_file_path)
            self.handle = self.session.add_torrent(
                {'ti': self.torrent_info, 'save_path': SAVE_PATH, 'storage_mode': lt.storage_mode_t.storage_mode_allocate})

        print("====> Waiting for metadata...")
        while not self.handle.status().has_metadata:
            time.sleep(.5)
        print("====> Metadata received successfully.")

        # Get torrent info from handle after metadata is received
        self.torrent_info = self.handle.torrent_file()
        self.file_path = os.path.join(SAVE_PATH, self.torrent_info.files().file_path(0))
        self.file_size = self.torrent_info.files().file_size(0)
        self.handle.read_piece(0)
        print(f"====> File size: {self.file_size}")

    def parse_chunk_range(self, vrange):
        start, end = vrange.replace('bytes=', '').split('-')
        start = int(start)
        end = int(end) if end else None
        self.piece_size = self.torrent_info.piece_length()
        print(f"====> Piece size: {self.piece_size}")
        piece_index = start // self.piece_size
        return {'piece_index': piece_index, 'start': start, 'end': end}

    def stream_torrent(self, vrange):
        parsed_range = self.parse_chunk_range(vrange)
        piece_index = parsed_range['piece_index']
        self.start_byte = parsed_range['start']
        self.end_byte = parsed_range['end']

        print(f"====> Reading piece: {piece_index}")
        self.handle.read_piece(piece_index)
        while not self.handle.have_piece(piece_index):
            time.sleep(.5)

        video_path = os.path.join(
            SAVE_PATH, self.torrent_info.files().file_path(0))
        with open(video_path, 'rb') as f:
            f.seek(self.start_byte)
            return f.read(self.piece_size)
        
    def stream_mkv(self, vrange):
        if not self.mkv_file_path:
            return None
        parsed_range = self.parse_chunk_range(vrange)
        self.start_byte = parsed_range['start']
        self.end_byte = parsed_range['end']
        print(f"====> Reading file from: {self.start_byte} from {self.mkv_file_path}")
        try:
            with open(self.mkv_file_path, 'rb') as f:
                f.seek(self.start_byte)
                return f.read(self.piece_size)
        except Exception as e:
            print('--------------------------------------------1')
            print(f"Error reading file: {e}")
            return None
        

    def create_response(self, vrange, type='mp4'):
        if type == 'mkv':
            data = self.stream_mkv(vrange)
            print('--------------------------------------------2')
            print(f"====> Data: {data}")
        else:
            data = self.stream_torrent(vrange)
        # if not data:
        #     raise Exception("Failed to read data from file.")
        
        response = HttpResponse(data, content_type=f"video/{type}", status=206)
        self.end_byte = self.start_byte + len(data) - 1
        print(
            f"====> Start byte: {self.start_byte} - End byte: {self.end_byte} - File size: {self.file_size}")
        response['Content-Range'] = f"bytes {self.start_byte}-{self.end_byte}/{self.file_size}"
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = len(data)
        return response

    def remove_stream(self):
        self.session.remove_torrent(self.handle)

    def convert_video_to_mkv(self):
        if not self.file_path:
            print("====> Movie path not found.")
            return
        self.mkv_file_path = self.file_path.replace(".mp4", ".mkv")
        if os.path.exists(self.mkv_file_path):
            print("====> Video already converted to mkv.")
            return
        print("====> Converting video to mkv...")
        try:
            while True:
                status = self.handle.status()
                print("====> Checking torrent status...", status.progress)
                if status.progress == 1.0:
                    print("====> Torrent finished downloading.")
                    if not self.file_path:
                        print("====> Movie path not found.")
                        return
                    input_path = self.file_path
                    output_path = self.file_path.replace(".mp4", ".mkv")
                    ffmpeg.input(input_path).output(output_path).run()
                    self.mkv_file_path = output_path
                    print("====> Video converted to mkv successfully.")
                    return
                time.sleep(1)
        except ffmpeg.Error as e:
            print(f"Error during conversion: {e.stderr.decode('utf-8')}")
            

    def __str__(self):
        return f"TorrentStream object with torrent file path: {self.torrent_info.files().file_path(0)}"
