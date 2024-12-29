import threading
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream
from .services.utils import construct_magnet_link

# Global dictionary to manage active streams
streams = {}


async def init_torrent_file(request):
    """
    Initialize a torrent file either by magnet link or by downloading a .torrent file,
    then start a background thread for MKV conversion.
    """
    torrent_url = request.GET.get('torrent_url')
    torrent_hash = request.GET.get('torrent_hash')
    movie_name = request.GET.get('movie_name')

    # If we have hash+movie name -> form a magnet link
    if torrent_hash and movie_name:
        magnet_url = construct_magnet_link(torrent_hash, movie_name)
        if not magnet_url:
            return JsonResponse({
                'status': 'error',
                'message': 'Magnet URL is required!'
            }, status=400)

        if torrent_hash in streams:
            # Already added
            return JsonResponse({
                'status': 'error',
                'message': 'Torrent file already added!',
                'stream_id': torrent_hash
            })

        ts = TorrentStream()
        ts.add_torrent(magnet_url)
        streams[torrent_hash] = ts

        # Run conversion in a separate thread
        thread = threading.Thread(target=ts.convert_video_to_mkv, daemon=True)
        thread.start()
        return JsonResponse({
            'status': 'success',
            'message': 'Torrent file added successfully!',
            'stream_id': torrent_hash
        })

    # If no magnet link but we have a torrent_url
    if not torrent_url:
        return JsonResponse({
            'status': 'error',
            'message': 'Torrent URL is required!'
        }, status=400)

    # Initialize torrent file from URL
    ts = TorrentStream()
    ts.init_torrent_file(torrent_url)
    ts.add_torrent()
    stream_id = torrent_url.split('/')[-1].split('.')[0]
    streams[stream_id] = ts

    # Start a thread for MKV conversion after the download
    thread = threading.Thread(target=ts.convert_video_to_mkv, daemon=True)
    thread.start()

    return JsonResponse({
        'status': 'success',
        'message': 'Torrent file added successfully!',
        'stream_id': stream_id
    })


def stream_torrent(request):
    """
    Stream either the MKV or MP4 file from a torrent.
    It uses HTTP Range requests for partial content.
    """
    stream_id = request.GET.get('stream_id')
    file_type = request.GET.get('file_type', 'mkv')  # default to mkv
    if not stream_id:
        return JsonResponse({
            'status': 'error',
            'message': 'stream_id is required!'
        }, status=400)

    ts = streams.get(stream_id)
    if not ts:
        return JsonResponse({
            'status': 'error',
            'message': 'Stream not found!'
        }, status=404)

    vrange = request.headers.get('Range', 'bytes=0-')
    response = ts.create_response(vrange, file_type)
    return response
