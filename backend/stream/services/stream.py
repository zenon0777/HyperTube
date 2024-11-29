import libtorrent as lt
from django.http import StreamingHttpResponse, HttpResponse
from django.shortcuts import get_object_or_404
import os

def stream_torrent(request, torrent_id):
    # Example: Find the torrent based on the provided ID
    # torrent = get_object_or_404(Torrent, id=torrent_id)

    # Path to your torrent file (could be a path stored in your database)
    # torrent_file_path = torrent.file_path

    # Load the torrent file into libtorrent
    ses = lt.session()
    info = lt.torrent_info()
    h = ses.add_torrent({'ti': info, 'save_path': './'})

    def get_video_chunk(start_byte, chunk_size=1024*1024):
        """Function to get a chunk of video from the torrent."""
        # Download the necessary chunk
        piece_start = start_byte
        piece_end = start_byte + chunk_size
        pieces = h.get_torrent_info().files()

        # Here, we're assuming it's a sequential file with a single video file.
        file = pieces[0]
        file_size = file.size

        # Check for the end of the file
        if piece_start >= file_size:
            return None

        # Read the next chunk
        with open(file.path, 'rb') as f:
            f.seek(piece_start)
            chunk = f.read(min(chunk_size, file_size - piece_start))

        return chunk

    def video_stream():
        start_byte = 0
        while start_byte < os.path.getsize(torrent_file_path):
            chunk = get_video_chunk(start_byte)
            if chunk is None:
                break
            start_byte += len(chunk)
            yield chunk

    response = StreamingHttpResponse(video_stream(), content_type='video/mp4')
    response['Content-Disposition'] = 'inline; filename="video.mp4"'
    return response
