# from django.shortcuts import Response
from django.http import HttpResponse, JsonResponse
from .services.stream import TorrentStream, StoredMovieStream
import json
import os
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
        if torrent_hash in streams:
            return JsonResponse({'status': 'error', 'message': 'Torrent file already added!', 'stream_id': torrent_hash})
        ts = TorrentStream()

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


def stream_stored_movie(request):
    movie_path = request.GET.get('movie_path', None)
    if not movie_path:
        return JsonResponse({'status': 'error', 'message': 'movie_path is required!'}, status=400)
    
    if not os.path.isabs(movie_path):
        movie_path = os.path.join('./_Movies', movie_path)
    
    if not os.path.exists(movie_path):
        return JsonResponse({'status': 'error', 'message': 'Movie file not found!'}, status=404)
    
    range_header = request.headers.get('Range')
    
    try:
        movie_stream = StoredMovieStream(movie_path)
        
        response = movie_stream.create_streaming_response(range_header)
        
        print(f"====> Streaming movie: {movie_path}")
        print(f"====> Content-Type: {response.get('Content-Type')}")
        print(f"====> Range: {range_header}")
        
        return response
        
    except Exception as e:
        print(f"Error streaming movie: {str(e)}")
        return JsonResponse({'status': 'error', 'message': f'Error streaming movie: {str(e)}'}, status=500)


def list_stored_movies(request):
    movies_dir = './_Movies'
    movies = []
    
    try:
        for item in os.listdir(movies_dir):
            item_path = os.path.join(movies_dir, item)
            if os.path.isdir(item_path):
                for file in os.listdir(item_path):
                    if file.lower().endswith(('.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.m4v', '.webm', '.ogg')):
                        relative_path = os.path.join(item, file)
                        file_size = os.path.getsize(os.path.join(item_path, file))
                        movies.append({
                            'name': file,
                            'path': relative_path,
                            'size': file_size,
                            'directory': item,
                            'needs_conversion': file.lower().endswith(('.mkv', '.avi', '.mov', '.wmv', '.flv', '.m4v'))
                        })
        
        return JsonResponse({'status': 'success', 'movies': movies})
        
    except Exception as e:
        print(f"Error listing movies: {str(e)}")
        return JsonResponse({'status': 'error', 'message': f'Error listing movies: {str(e)}'}, status=500)
