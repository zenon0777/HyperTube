# from django.shortcuts import Response
from django.http import JsonResponse
from .services.stream import Stream


def stream_torrent(request):
    torrent_url = request.GET.get('torrent_url', None)
    if not torrent_url:
        return JsonResponse({'status': 'error', 'message': 'Torrent URL is required!'}, status=400)
    s = Stream("test_movie", torrent_url)
    s.download_torrent_file()
    # s.download_torrent()
    return s.stream_torrent()
