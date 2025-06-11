"use client"; // Important for using useRouter and event handlers

import React from "react";
import Image from "next/image";
import { PlayArrow, InfoOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation"; // For Next.js App Router

interface MovieCardProps {
  movie: any; // Movie data can vary between providers
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

  // --- Adaptable data extraction based on provider ---
  let title: string = "N/A";
  let posterUrl: string | null = null;
  let year: string | number = "N/A";
  let rating: string | number = "N/A";
  let overview: string = "No overview available.";
  let movieId: string | number | null = null;

  if (provider === "TMDB") {
    title = movie?.title || movie?.name || "Untitled";
    if (movie?.poster_path) {
      posterUrl = `${tmdbImageUrlBase}${movie.poster_path}`;
    }
    year = movie?.release_date
      ? new Date(movie.release_date).getFullYear()
      : movie?.first_air_date
      ? new Date(movie.first_air_date).getFullYear()
      : "N/A";
    rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    overview = movie?.overview || "No overview available.";
    movieId = movie?.id;
  } else if (provider === "YTS") {
    title = movie?.title_long || movie?.title || "Untitled";
    posterUrl = movie?.medium_cover_image || movie?.large_cover_image || null;
    year = movie?.year || "N/A";
    rating = movie?.rating || "N/A";
    overview = movie?.summary || movie?.synopsis || "No overview available.";
    movieId = movie?.id;
  } else {
    title = movie?.title || "Unknown Title";
    posterUrl = movie?.poster_path
      ? `${tmdbImageUrlBase}${movie.poster_path}`
      : movie?.poster || null;
    year = movie?.release_date
      ? new Date(movie.release_date).getFullYear()
      : movie?.year || "N/A";
    rating = movie?.vote_average
      ? movie.vote_average.toFixed(1)
      : movie?.rating || "N/A";
    overview = movie?.overview || movie?.summary || "No overview available.";
    movieId = movie?.id;
  }

  return (
    <div
      className={`
        bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg
        transform transition-all duration-300 ease-out
        flex flex-col relative cursor-pointer
        ${
          isHovered
            ? "scale-105 ring-2 ring-orange-500 z-20"
            : "hover:scale-102 z-10"
        }
      `}
      // onClick={handleDetailsClick}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`Poster for ${title}`}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 group-hover:opacity-60"
            priority={false}
            unoptimized={provider === "YTS"}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-poster.png";
              (e.target as HTMLImageElement).alt = "Image not available";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            {/* placeholder SVG */}
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`
            absolute inset-0 bg-black/70
            transition-opacity duration-300 flex flex-col
            ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          {/* Centered buttons */}
          <div className="flex-grow flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                router.push(`/watch/${movieId}`);
              }}
              className="px-2 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full flex items-center space-x-1 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
              aria-label={`Watch ${title}`}
            >
              <PlayArrow fontSize="medium" />
            </button>
            <button
              onClick={() => {
                router.push(`/browse/movie/${movieId}`);
              }}
              className="px-2 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-full flex items-center space-x-1 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label={`View details for ${title}`}
            >
              <InfoOutlined fontSize="medium" />
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
        className={`p-3 transition-all duration-300 ${
          isHovered ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <h3 className="text-sm font-semibold text-gray-100 truncate h-6">
          {title}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
          <span>{year}</span>
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
