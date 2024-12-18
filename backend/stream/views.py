# from django.shortcuts import Response
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream

streams = {}

def init_torrent_file(request):
    torrent_url = request.GET.get('torrent_url', None)
    if not torrent_url:
        return JsonResponse({'status': 'error', 'message': 'Torrent URL is required!'}, status=400)
    ts = TorrentStream()
    ts.init_torrent_file(torrent_url)
    ts.add_torrent()
    stream_id = torrent_url.split('/')[-1].split('.')[0]
    streams[stream_id] = ts
    print(f"====> Stream ID: {stream_id}")
    return JsonResponse({'status': 'success', 'message': 'Torrent file added successfully!', 'stream_id': stream_id})


def stream_torrent(request):
    stream_id = request.GET.get('stream_id', None)
    if not stream_id:
        return JsonResponse({'status': 'error', 'message': 'stream_id is required!'}, status=400)

    vrange = request.headers.get('Range', 'bytes=0-')
    ts = streams.get(stream_id)
    if not ts:
        return JsonResponse({'status': 'error', 'message': 'Stream not found!'}, status=404)
    data = ts.stream_torrent(vrange)

    response = ts.create_response(data)
    return response
