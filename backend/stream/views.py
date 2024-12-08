# from django.shortcuts import Response
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream


def stream_torrent(request):
    torrent_url = request.GET.get('torrent_url', None)
    if not torrent_url:
        return JsonResponse({'status': 'error', 'message': 'Torrent URL is required!'}, status=400)
    ts = TorrentStream()
    ts.init_torrent_file(torrent_url)
    ts.add_torrent()
    # vrange = request.headers.get('Range', None)
    # data = ts.stream_torrent(vrange if vrange else 'bytes=0-')

    # response = ts.create_response(data)
    # ts.remove_stream()
    return JsonResponse({'status': 'success', 'message': 'Stream started successfully!'}, status=200)
