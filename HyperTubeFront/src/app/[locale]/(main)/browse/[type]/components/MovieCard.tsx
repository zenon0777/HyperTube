"use client";

import React from "react";
import Image from "next/image";
import { PlayArrow } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface MovieData {
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  id?: string | number;

  // YTS fields
  title_long?: string;
  medium_cover_image?: string;
  large_cover_image?: string;
  year?: string | number;
  rating?: string | number;
  summary?: string;
  synopsis?: string;

  // Generic fields
  poster?: string;
  is_watched?: boolean;
}

interface MovieCardProps {
  movie: MovieData;
  isHovered: boolean;
  provider: "TMDB" | "YTS" | string; // Specify known providers or allow any string
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isHovered,
  provider,
}) => {
  const router = useRouter();
  const tmdbImageUrlBase = "https://image.tmdb.org/t/p/w500"; // Standard TMDB image size

  const t = useTranslations();

  let title: string = t('browse.movieCard.unknownTitle');
  let posterUrl: string | null = null;
  let year: string | number = "N/A";
  let rating: string | number = "N/A";
  let movieId: string | number | null = null;

  if (provider === "TMDB") {
    title = movie?.title || movie?.name || t('browse.movieCard.unknownTitle');
    if (movie?.poster_path) {
      posterUrl = `${tmdbImageUrlBase}${movie.poster_path}`;
    }
    year = movie?.release_date
      ? new Date(movie.release_date).getFullYear()
      : movie?.first_air_date
        ? new Date(movie.first_air_date).getFullYear()
        : "N/A";
    rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    movieId = movie?.id || null;
  } else if (provider === "YTS") {
    title = movie?.title_long || movie?.title || t('browse.movieCard.unknownTitle');
    posterUrl = movie?.medium_cover_image || movie?.large_cover_image || null;
    year = movie?.year || "N/A";
    rating = movie?.rating || "N/A";
    movieId = movie?.id || null;
  } else {
    title = movie?.title || t('browse.movieCard.unknownTitle');
    posterUrl = movie?.poster_path
      ? `${tmdbImageUrlBase}${movie.poster_path}`
      : movie?.poster || null;
    year = movie?.release_date
      ? new Date(movie.release_date).getFullYear()
      : movie?.year || "N/A";
    rating = movie?.vote_average
      ? movie.vote_average.toFixed(1)
      : movie?.rating || "N/A";
    movieId = movie?.id || null;
  }

  return (
    <div
      className={`
        bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg
        transform transition-all duration-300 ease-out
        flex flex-col relative cursor-pointer
        ${isHovered
          ? "scale-105 ring-2 ring-orange-500 z-20"
          : "hover:scale-102 z-10"
        }
      `}
      onClick={() => {
        router.push(`/browse/movie/${movieId}`);
      }}
    >
      <div className="relative w-full aspect-[2/3]">
        {posterUrl ? (
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={posterUrl}
            alt={`Poster for ${title}`}
            fill
            className="transition-opacity duration-300 group-hover:opacity-60"
            priority={true}
            unoptimized={provider === "YTS"}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/500x750.png?text=No+Image";
              (e.target as HTMLImageElement).alt = "Image not available";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Image
              src="https://placehold.co/500x750.png?text=No+Image"
              alt="Image not available"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div
          className={`
            absolute inset-0 bg-black/70
            transition-opacity duration-300 flex flex-col
            ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <div className="flex-grow flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                router.push(`/browse/movie/${movieId}`);
              }}
              className="px-2 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full flex items-center space-x-1 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
              aria-label={`${t('browse.movieCard.watch')} ${title}`}
            >
              <PlayArrow fontSize="medium" />
            </button>
          </div>
          <div className="p-3 pb-4 text-center">
            <h3 className="text-lg font-bold text-white drop-shadow-md whitespace-normal break-words">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div
        className={`p-3 transition-all duration-300 ${isHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
      >
        <h3 className="text-sm font-semibold text-gray-100 truncate h-6">
          {title}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
          <span>{year}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${movie.is_watched
            ? 'bg-green-500/20 text-green-400'
            : 'bg-gray-500/20 text-gray-400'
            }`}>
            {movie.is_watched ? '✓ Watched' : '○ Not Watched'}
          </span>
          {rating !== "N/A" && rating !== 0 && (
            <span className="flex items-center">
              <span className="mr-1">⭐</span>
              {rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
