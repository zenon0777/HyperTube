import threading
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream
from .services.utils import construct_magnet_link

# Global dictionary to manage active streams
streams = {}


async def init_stream(request):
    torrent_hash = request.GET.get('torrent_hash')
    movie_name = request.GET.get('movie_name')

    if not torrent_hash or not movie_name:
        return JsonResponse({
            'status': 'error',
            'message': 'torrent_hash and movie_name are required!'
        }, status=400)
    
    magnet_url = construct_magnet_link(torrent_hash, movie_name)
    if not magnet_url:
        return JsonResponse({
            'status': 'error',
            'message': 'Magnet URL is required!'
        }, status=400)

    if torrent_hash in streams:
        # Already added
        return JsonResponse({
            'message': 'Torrent file already added!',
            'stream_id': torrent_hash
        })

    ts = TorrentStream()
    ts.add_torrent(magnet_url)
    streams[torrent_hash] = ts

    # start converting file to mkv
    thread = threading.Thread(target=ts.convert_video_to_mkv, daemon=True)
    thread.start()
    return JsonResponse({
        'status': 'success',
        'message': 'Torrent file added successfully!',
        'stream_id': torrent_hash
    })
        
        
async def init_torrent_file(request):
    torrent_url = request.GET.get('torrent_url')
    if not torrent_url:
        return JsonResponse({
            'status': 'error',
            'message': 'Torrent URL is required!'
        }, status=400)

    ts = TorrentStream()
    ts.init_torrent_file(torrent_url)
    ts.add_torrent()
    stream_id = torrent_url.split('/')[-1].split('.')[0]
    streams[stream_id] = ts

    # start converting file to mkv
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
    video_format = request.GET.get('video_format', 'mp4')
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
    response = ts.create_response(vrange, video_format)
    return response
