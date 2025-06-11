'use client';

import React, { useState, useEffect } from 'react';
import CustomReactPlayer from '@/components/Video/CustomReactPlayer';

interface Movie {
  name: string;
  path: string;
  size: number;
  directory: string;
  needs_conversion: boolean;
}

interface ApiResponse {
  status: string;
  movies: Movie[];
  message?: string;
}

const VideoStreamingTest: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/stream/movies/list/`);
      const data: ApiResponse = await response.json();
      
      if (data.status === 'success') {
        setMovies(data.movies);
        setError(null);
      } else {
        setError(data.message || 'Failed to load movies');
      }
    } catch (err) {
      setError('Error connecting to backend: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStreamUrl = (movie: Movie): string => {
    return `${API_BASE_URL}/stream/movie/?movie_path=${encodeURIComponent(movie.path)}`;
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'UNKNOWN';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🎬 HyperTube Video Streaming Test
        </h1>
        
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Format Conversion Demo</h2>
          <p className="text-gray-300 mb-4">
            This demo showcases HyperTube's ability to stream videos with on-the-fly format conversion. 
            MKV files and other non-browser-compatible formats are automatically converted to MP4 
            using FFmpeg in the Docker container.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded">
              <h3 className="font-semibold text-yellow-400 mb-2">⚙️ Conversion Required</h3>
              <p>MKV, AVI, MOV, WMV, FLV files are converted to MP4 on-the-fly</p>
            </div>
            <div className="bg-green-900/30 border border-green-600 p-4 rounded">
              <h3 className="font-semibold text-green-400 mb-2">✅ Browser Compatible</h3>
              <p>MP4, WebM, OGG files are streamed directly without conversion</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Available Movies</h2>
            <button
              onClick={loadMovies}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-600 p-4 rounded mb-4">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2">Loading movies...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMovie(movie)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedMovie?.path === movie.path
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{movie.name}</h3>
                      <p className="text-gray-400 text-sm">Directory: {movie.directory}</p>
                      <p className="text-gray-400 text-sm">Size: {formatFileSize(movie.size)}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded text-sm ${
                        movie.needs_conversion
                          ? 'bg-yellow-900/50 text-yellow-300'
                          : 'bg-green-900/50 text-green-300'
                      }`}>
                        {getFileExtension(movie.name)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {movie.needs_conversion ? 'Needs Conversion' : 'Browser Compatible'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMovie && (
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Video Player</h2>
              
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Now Playing: {selectedMovie.name}</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Format:</strong> {getFileExtension(selectedMovie.name)}
                  </div>
                  <div>
                    <strong>Size:</strong> {formatFileSize(selectedMovie.size)}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span className={selectedMovie.needs_conversion ? 'text-yellow-400' : 'text-green-400'}>
                      {selectedMovie.needs_conversion ? 'Converting on-the-fly' : 'Direct streaming'}
                    </span>
                  </div>
                </div>
                
                {selectedMovie.needs_conversion && (
                  <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded text-sm">
                    <p className="text-yellow-300">
                      ⚙️ This {getFileExtension(selectedMovie.name)} file is being converted to MP4 
                      in real-time using FFmpeg. The conversion happens on-demand as you stream, 
                      so there may be a brief initial delay.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-black rounded-lg overflow-hidden">
                <CustomReactPlayer
                  streamUrl={getStreamUrl(selectedMovie)}
                  tracks={[]} // No subtitles for this demo
                  movieId={selectedMovie.path}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStreamingTest;
