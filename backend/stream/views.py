# from django.shortcuts import Response
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream
import json
from .services.utils import construct_magnet_link

streams = {}

def init_torrent_file(request):
    torrent_url = request.GET.get('torrent_url', None)
    torrent_hash = request.GET.get('torrent_hash', None)
    movie_name = request.GET.get('movie_name', None)
    
    if torrent_hash and movie_name:
        magnet_url = construct_magnet_link(torrent_hash, movie_name)
        if not magnet_url:
            return JsonResponse({'status': 'error', 'message': 'Magnet URL is required!'}, status=400)
        ts = TorrentStream()
        magnet_url = "magnet:?xt=urn:btih:96DCE3AEFFF1F881BC4953C89E13B8C823EB5C5C&dn=Gladiator+II+%282024%29+%5B720p%5D+%5BYTS.MX%5D&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.tracker.cl%3A1337%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=https%3A%2F%2Fopentracker.i2p.rocks%3A443%2Fannounce"
        ts.add_torrent(magnet_url)
        streams[torrent_hash] = ts
        print(f"====> Stream ID: {torrent_hash}")
        return JsonResponse({'status': 'success', 'message': 'Torrent file added successfully!', 'stream_id': torrent_hash})
    else:
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
    print(f"====> Stream: {ts}")
    if not ts:
        return JsonResponse({'status': 'error', 'message': 'Stream not found!'}, status=404)
    data = ts.stream_torrent(vrange)

    response = ts.create_response(data)
    return response
