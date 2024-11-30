from django.http import StreamingHttpResponse, HttpResponse
import requests
import libtorrent as lt
import time
import os


class Stream:
    def __init__(self, movie_name: str, torrent_url: str):
        if not os.path.exists("/tmp/torrent_files"):
            os.makedirs("/tmp/torrent_files")
        self.movie_name = movie_name
        self.torrent_url = torrent_url
        self.torrent_file_path = None

    def download_torrent_file(self):
        response = requests.get(self.torrent_url)

        if response.status_code == 200:
            file_path = f"/tmp/torrent_files/{self.movie_name}.torrent"
            if not os.path.exists(file_path):
                with open(f"/tmp/torrent_files/{self.movie_name}.torrent", 'wb') as f:
                    f.write(response.content)
                print("Torrent file downloaded successfully.")
            else:
                print("Torrent file already exists.")
            self.torrent_file_path = file_path

        else:
            print(
                f"Failed to download the torrent. Status code: {response.status_code}")

    def download_torrent(self):
        ses = lt.session()

        torrent_info = lt.torrent_info(self.torrent_file_path)

        save_path = './'

        handle = ses.add_torrent({'ti': torrent_info, 'save_path': save_path, 'storage_mode': lt.storage_mode_t.storage_mode_sparse})

        print(f"Downloading torrent from: {self.torrent_file_path}")
        print("Press Ctrl+C to stop the download")

        while not handle.is_seed():
            status = handle.status()
            print(f"{status.state} {status.download_rate / 1000:.1f} kB/s {status.upload_rate / 1000:.1f} kB/s {status.progress * 100:.1f}%")
            time.sleep(1)

        print("Download complete.")
        print(f"Downloaded file is saved in: {save_path}")
        
    def stream_torrent(self):
        if not self.torrent_file_path:
            return HttpResponse("Torrent file path is required!", status=400)
        
        # Create a session
        session = lt.session()
        session.listen_on(6881, 6891)
        
        
        # Add a torrent
        print(f"====> Adding torrent from: {self.torrent_file_path}")
        torrent_info = lt.torrent_info(self.torrent_file_path)
        handle = session.add_torrent({'ti': torrent_info, 'save_path': './'})
        
        
        # get the info hash
        selected_file = torrent_info.files()
        print(f"====> Selected file: {selected_file}")
        file_size = selected_file.piece_size(0)
        file_name = selected_file.file_name(0)
        video_path = os.path.join('./', selected_file.file_path(0))
        num_of_pieces = torrent_info.num_pieces()
        print(f"====> Selected file: {file_name} - {file_size} - {num_of_pieces} - video_path: {video_path}")


        # Wait for the metadata
        print("====> Waiting for metadata...")
        while not handle.status().has_metadata:
            time.sleep(.5)
            
        # Start streaming
        print("====> reading on peace...")
        # for piece_index in range(torrent_info.num_pieces()):
            
        handle.read_piece(0)
        while not handle.have_piece(0):
            time.sleep(.1)
        session.remove_torrent(handle)

        with open(video_path, 'rb') as f:
            f.seek(0)
            print("chunk:", f.read(100))
        



        return HttpResponse("Streaming completed successfully.")


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

        self.movie_path = None
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

    def add_torrent(self):
        print(f"====> Adding torrent from: {self.torrent_file_path}")
        self.torrent_info = lt.torrent_info(self.torrent_file_path)
        self.handle = self.session.add_torrent({'ti': self.torrent_info, 'save_path': SAVE_PATH, 'storage_mode': lt.storage_mode_t.storage_mode_sparse})

        print("====> Waiting for metadata...")
        while not self.handle.status().has_metadata:
            time.sleep(.5)
        print("====> Metadata received successfully.")

        self.movie_path = os.path.join(SAVE_PATH, self.torrent_info.files().file_path(0))
        self.file_size = self.torrent_info.files().file_size(0)

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
            time.sleep(.1)
        
        

        video_path = os.path.join(SAVE_PATH, self.torrent_info.files().file_path(0))

        with open(video_path, 'rb') as f:
            f.seek(0)
            return f.read(self.torrent_info.piece_length())

    def create_response(self, data):
        response = StreamingHttpResponse(data, content_type="video/mp4", status=206)
        self.end_byte = self.start_byte + len(data) - 1
        print(f"====> Start byte: {self.start_byte} - End byte: {self.end_byte} - File size: {self.file_size}")
        response['Content-Range'] = f'bytes {self.start_byte}-{self.end_byte}/{self.file_size}'
        response['Content-Length'] = len(data)
        response['Accept-Ranges'] = 'bytes'
        return response

    def remove_stream(self):
        self.session.remove_torrent(self.handle)
