# from django.shortcuts import Response
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream


def stream_torrent(request):
    # torrent_url = request.GET.get('torrent_url', None)
    # if not torrent_url:
    #     return JsonResponse({'status': 'error', 'message': 'Torrent URL is required!'}, status=400)
    torrent_url = "https://yts.mx/torrent/download/C7F59A9DA3B3615CA92E8587F1EED9903F098163"
    ts = TorrentStream()
    # s.download_torrent_file()
    # s.download_torrent()
    # return s.stream_torrent()
    ts.init_torrent_file(torrent_url)
    ts.add_torrent()
    vrange = request.headers.get('Range', None)
    data = ts.stream_torrent(vrange if vrange else 'bytes=0-')

    return ts.create_response(data)
