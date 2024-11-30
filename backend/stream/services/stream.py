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
            with open(f"/tmp/torrent_files/{self.movie_name}.torrent", 'wb') as f:
                f.write(response.content)
            print("Torrent file downloaded successfully.")
            self.torrent_file_path = f"/tmp/torrent_files/{self.movie_name}.torrent"

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
        ses = lt.session()
        ses.listen_on(6881, 6891)
        torrent_info = lt.torrent_info(self.torrent_file_path)
        h = ses.add_torrent({'ti': torrent_info, 'save_path': './'})
        
        print("Downloading metadata...")
        while not h.has_metadata():
            time.sleep(1)
        print("Metadata received, starting download...")
        torrent_info = h.get_torrent_info()
        while not h.have_piece(1):
            time.sleep(0.1)
        print("test ===> ", h.have_piece(1))
        def get_video_chunk(start_byte, chunk_size=1024*1024):
            """Function to get a chunk of video from the torrent."""
            # Download the necessary chunk
            piece_start = start_byte
            piece_end = start_byte + chunk_size
            torrent_info = h.get_torrent_info()
            print("torrent_info: ", torrent_info)
            # pieces = torrent_info.files()

            # file = pieces[0]
            # file_size = file.size

            # # Check for the end of the file
            # if piece_start >= file_size:
            #     return None

            # # Read the next chunk
            # with open(file.path, 'rb') as f:
            #     f.seek(piece_start)
            #     chunk = f.read(min(chunk_size, file_size - piece_start))

            return "ff"

        def video_stream():
            start_byte = 0
            while start_byte < os.path.getsize(self.torrent_file_path):
                chunk = get_video_chunk(start_byte)
                if chunk is None:
                    break
                start_byte += len(chunk)
                yield chunk

        response = StreamingHttpResponse(video_stream(), content_type='video/mp4')
        response['Content-Disposition'] = 'inline; filename="video.mp4"'
        return response
        # return {'status': 'success', 'message': 'Stream torrent successfully!'}
