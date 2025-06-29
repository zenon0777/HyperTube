
from django.http import HttpResponse, StreamingHttpResponse
import requests
import libtorrent as lt
import time
import os
import ffmpeg
import subprocess
import tempfile
import threading
from pathlib import Path
import mimetypes

SAVE_PATH = './_Movies'
TORRENT_FILES_PATH = '/tmp/torrent_files'

BROWSER_COMPATIBLE_FORMATS = {'.mp4', '.webm', '.ogg'}
CONVERSION_FORMATS = {'.mkv', '.avi', '.mov', '.wmv', '.flv', '.m4v'}

import datetime

def cleanup_old_movies(directory=SAVE_PATH, days=30):
    now = datetime.datetime.now().timestamp()
    cutoff = now - days * 86400
    removed_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                stat = os.stat(file_path)
                file_age = min(stat.st_atime, stat.st_mtime, stat.st_ctime)
                if file_age < cutoff:
                    os.remove(file_path)
                    removed_files.append(file_path)
            except Exception as e:
                print(f"[Cleanup] Failed to remove {file_path}: {e}")
    removed_dirs = []
    for root, dirs, files in os.walk(directory, topdown=False):
        for d in dirs:
            dir_path = os.path.join(root, d)
            try:
                if not os.listdir(dir_path):
                    os.rmdir(dir_path)
                    removed_dirs.append(dir_path)
            except Exception as e:
                print(f"[Cleanup] Failed to remove directory {dir_path}: {e}")
    if removed_files:
        print(f"[Cleanup] Removed {len(removed_files)} old movie files:")
        for f in removed_files:
            print(f"  - {f}")
    else:
        print("[Cleanup] No old movie files found.")
    if removed_dirs:
        print(f"[Cleanup] Removed {len(removed_dirs)} empty directories:")
        for d in removed_dirs:
            print(f"  - {d}")

def start_cleanup_timer(interval=30, file_age=30, directory=SAVE_PATH):
    def run():
        while True:
            try:
                cleanup_old_movies(directory=directory)
            except Exception as e:
                print(f"[Cleanup] Timer error: {e}")
            time.sleep(3600)
    t = threading.Thread(target=run, daemon=True)
    t.start()


SAVE_PATH = './_Movies'
TORRENT_FILES_PATH = '/tmp/torrent_files'

BROWSER_COMPATIBLE_FORMATS = {'.mp4', '.webm', '.ogg'}
CONVERSION_FORMATS = {'.mkv', '.avi', '.mov', '.wmv', '.flv', '.m4v'}


class VideoConverter:
    
    @staticmethod
    def get_video_format(file_path):
        return Path(file_path).suffix.lower()
    
    @staticmethod
    def needs_conversion(file_path):
        format_ext = VideoConverter.get_video_format(file_path)
        return format_ext in CONVERSION_FORMATS
    
    @staticmethod
    def is_browser_compatible(file_path):
        format_ext = VideoConverter.get_video_format(file_path)
        return format_ext in BROWSER_COMPATIBLE_FORMATS
    
    @staticmethod
    def get_content_type(file_path):
        format_ext = VideoConverter.get_video_format(file_path)
        if format_ext == '.webm':
            return 'video/webm'
        elif format_ext == '.ogg':
            return 'video/ogg'
        else:
            return 'video/mp4'
    
    @staticmethod
    def convert_video_chunk(input_path, start_byte, chunk_size, output_format='mp4'):
        if not os.path.exists(input_path) or not os.path.isfile(input_path):
            raise ValueError("Invalid input path")

        if output_format not in ['mp4', 'webm']:
            raise ValueError("Invalid output format")

        try:
            duration_cmd = ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration', 
                            '-of', 'csv=p=0', input_path]
            duration_result = subprocess.run(duration_cmd, capture_output=True, text=True)

            if duration_result.returncode == 0:
                total_duration = float(duration_result.stdout.strip())
                file_size = os.path.getsize(input_path)
                time_offset = (start_byte / file_size) * total_duration
            else:
                time_offset = 0

            cmd = [
                'ffmpeg',
                '-ss', str(time_offset),
                '-i', input_path,
                '-t', '10',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-preset', 'ultrafast',
                '-tune', 'zerolatency',
                '-movflags', 'frag_keyframe+empty_moov',
                '-f', output_format,
                '-'
            ]

            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return process

        except Exception as e:
            print(f"Error in video conversion: {str(e)}")
            return None


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
        self.converter = VideoConverter()

        try:
            start_cleanup_timer()
        except Exception as e:
            print(f"[Cleanup] Error starting cleanup timer: {e}")

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
        self.movie_path = os.path.join(SAVE_PATH, self.torrent_info.files().file_path(0))
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
        
        if self.converter.needs_conversion(video_path):
            print(f"====> Video format requires conversion: {video_path}")
            return self.stream_converted_video(video_path, self.start_byte)
        else:
            with open(video_path, 'rb') as f:
                f.seek(self.start_byte)
                return f.read(self.piece_size)

    def stream_converted_video(self, video_path, start_byte):
        try:
            process = self.converter.convert_video_chunk(video_path, start_byte, self.piece_size)
            if process:
                converted_data = process.stdout.read(self.piece_size)
                process.terminate()
                return converted_data
            else:
                with open(video_path, 'rb') as f:
                    f.seek(start_byte)
                    return f.read(self.piece_size)
        except Exception as e:
            print(f"Error streaming converted video: {str(e)}")
            with open(video_path, 'rb') as f:
                f.seek(start_byte)
                return f.read(self.piece_size)

    def create_response(self, data):
        video_path = os.path.join(SAVE_PATH, self.torrent_info.files().file_path(0))
        content_type = self.converter.get_content_type(video_path)
        
        response = HttpResponse(data, content_type=content_type, status=206)
        self.end_byte = self.start_byte + len(data) - 1
        print(f"====> Chunk size after: {len(data)}")
        print(f"====> Content-Type: {content_type}")
        print(
            f"====> Start byte: {self.start_byte} - End byte: {self.end_byte} - File size: {self.file_size}")
        response['Content-Range'] = f"bytes {self.start_byte}-{self.end_byte}/{self.file_size}"
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = len(data)
        return response

    def remove_stream(self):
        self.session.remove_torrent(self.handle)

    async def convert_video(self):
        if self.movie_path and self.converter.needs_conversion(self.movie_path):
            print(f"====> Converting video {self.movie_path} to browser-compatible format...")
            return True
        else:
            print("====> Video is already in browser-compatible format")
            return False

    def __str__(self):
        return f"TorrentStream object with torrent file path: {self.torrent_info.files().file_path(0)}"


class StoredMovieStream:
    
    def __init__(self, movie_path):
        self.movie_path = movie_path
        self.file_size = os.path.getsize(movie_path) if os.path.exists(movie_path) else 0
        self.converter = VideoConverter()
        self.start_byte = 0
        self.end_byte = None
    
    def parse_range_header(self, range_header):
        if not range_header:
            return None
        
        range_match = range_header.replace('bytes=', '').split('-')
        start = int(range_match[0]) if range_match[0] else 0
        end = int(range_match[1]) if range_match[1] else self.file_size - 1
        
        return {'start': start, 'end': end}
    
    def stream_movie(self, range_header=None):
        if not os.path.exists(self.movie_path):
            raise FileNotFoundError(f"Movie file not found: {self.movie_path}")
        
        if self.converter.needs_conversion(self.movie_path):
            print(f"====> Converting {self.movie_path} on-the-fly")
            return self.stream_converted_movie_simple()
        else:
            print(f"====> Streaming {self.movie_path} directly")
            if range_header:
                range_info = self.parse_range_header(range_header)
                if range_info:
                    self.start_byte = range_info['start']
                    self.end_byte = range_info['end']
            
            if not self.end_byte:
                self.end_byte = self.file_size - 1
            
            chunk_size = min(1024 * 1024, self.end_byte - self.start_byte + 1)
            return self.stream_original_movie(chunk_size)
    
    def stream_converted_movie_simple(self):
        try:
            print(f"====> Starting simple FFmpeg conversion")
            
            cmd = [
                'ffmpeg',
                '-i', self.movie_path,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-preset', 'ultrafast',
                '-tune', 'zerolatency',
                '-movflags', 'frag_keyframe+empty_moov+faststart',
                '-f', 'mp4',
                'pipe:1'
            ]
            
            print(f"====> FFmpeg command: {' '.join(cmd)}")
            
            process = subprocess.Popen(
                cmd, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE,
                bufsize=0
            )
            
            chunk_size = 64 * 1024
            
            try:
                while True:
                    data = process.stdout.read(chunk_size)
                    if not data:
                        print("====> FFmpeg conversion completed")
                        break
                    yield data
                    
            except Exception as e:
                print(f"====> Error during FFmpeg streaming: {str(e)}")
            finally:
                try:
                    process.terminate()
                    process.wait(timeout=5)
                except:
                    process.kill()
                    
        except Exception as e:
            print(f"Error in streaming conversion: {str(e)}")
            print("====> Falling back to original file streaming")
            chunk_size = 64 * 1024
            with open(self.movie_path, 'rb') as f:
                while True:
                    data = f.read(chunk_size)
                    if not data:
                        break
                    yield data
    
    def stream_original_movie(self, chunk_size):
        with open(self.movie_path, 'rb') as f:
            f.seek(self.start_byte)
            remaining = self.end_byte - self.start_byte + 1
            
            while remaining > 0:
                read_size = min(chunk_size, remaining)
                data = f.read(read_size)
                if not data:
                    break
                remaining -= len(data)
                yield data
    
    def create_streaming_response(self, range_header=None):
        content_type = self.converter.get_content_type(self.movie_path)
        
        if self.converter.needs_conversion(self.movie_path):
            print("====> Creating streaming response for converted file (no range support)")
            
            def generate():
                yield from self.stream_movie()
            
            response = StreamingHttpResponse(
                generate(),
                content_type=content_type,
                status=200
            )
            
            response['Accept-Ranges'] = 'none'
            response['Cache-Control'] = 'no-cache'
            
        else:
            if range_header:
                range_info = self.parse_range_header(range_header)
                if range_info:
                    self.start_byte = range_info['start']
                    self.end_byte = range_info['end']
            
            if not self.end_byte:
                self.end_byte = self.file_size - 1
            
            def generate():
                yield from self.stream_movie(range_header)
            
            response = StreamingHttpResponse(
                generate(),
                content_type=content_type,
                status=206 if range_header else 200
            )
            
            if range_header:
                content_length = self.end_byte - self.start_byte + 1
                response['Content-Range'] = f'bytes {self.start_byte}-{self.end_byte}/{self.file_size}'
                response['Content-Length'] = str(content_length)
            else:
                response['Content-Length'] = str(self.file_size)
            
            response['Accept-Ranges'] = 'bytes'
            response['Cache-Control'] = 'no-cache'
        
        return response
