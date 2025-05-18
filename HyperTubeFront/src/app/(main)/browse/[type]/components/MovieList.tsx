import { FavoriteBorder, InfoOutlined, PlayCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import React, { useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { categoryOptions } from "../page";

// interface Movie {
//   id: number;
//   title: string;
//   genre: string;
//   year: string;
//   runtime: number;
//   large_cover_image: string;
// }

interface MoviesListProps {
  movies: any[];
  isLoading: boolean;
  activeFilters: {
    quality: string | null;
    years: string | null;
    categories: categoryOptions[] | [];
    orderBy: string | null;
    provider: string;
  };
  setHoveredMovie: (movieId: number | null) => void;
  hoveredMovie: number | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MoviesList = React.memo(
  ({
    movies,
    isLoading,
    activeFilters,
    setHoveredMovie,
    hoveredMovie,
    currentPage,
    totalPages,
    onPageChange,
  }: MoviesListProps) => {
    const generatePageNumbers = useCallback(() => {
      const pageNumbers: (number | string)[] = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
          pageNumbers.push("...");
        }

        for (let i = start; i <= end; i++) {
          pageNumbers.push(i);
        }

        if (end < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }

      return pageNumbers;
    }, [currentPage, totalPages]);

    return (
      <div className="col-span-3 rounded-2xl pl-6 pb-6 min-h-[100vh]">
        <h1 className="text-2xl font-bold mb-6">
          Showing results for:
          {activeFilters.quality && (
            <span className="ml-4 text-sm text-gray-400">
              Quality: {activeFilters.quality}
            </span>
          )}
          {activeFilters.years && (
            <span className="ml-4 text-sm text-gray-400">
              Years: {activeFilters.years}
            </span>
          )}
          {activeFilters.categories.length > 0 && (
            <span className="ml-4 text-sm text-gray-400">
              Categories:{" "}
              {activeFilters.categories.map((cat) => cat.name).join(", ")}
            </span>
          )}
          {activeFilters.orderBy && (
            <span className="ml-4 text-sm text-gray-400">
              Order: {activeFilters.orderBy}
            </span>
          )}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg shadow-lg"
                >
                  <Skeleton className="w-full h-[350px] object-cover rounded-lg" />
                  <Skeleton className="mt-2 h-6 w-3/4" />
                  <Skeleton className="mt-1 h-4 w-1/2" />
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <Image
                      width={300}
                      height={350}
                      loading="lazy"
                      src={
                        (movie.poster_path &&
                          `https://image.tmdb.org/t/p/w300${movie.poster_path}`) ||
                        (movie.large_cover_image && movie.large_cover_image) ||
                        "https://fakeimg.pl/300x350/"
                      }
                      alt={movie.title}
                      className="object-cover h-[350px] transition-transform duration-300 group-hover:scale-105"
                    />

                    {hoveredMovie === movie.id && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-4">
                          <Tooltip title="Play" arrow>
                            <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                              <PlayCircle fontSize="large" />
                            </button>
                          </Tooltip>
                          <Tooltip title="More Info" arrow>
                            <button className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors">
                              <InfoOutlined fontSize="large" />
                            </button>
                          </Tooltip>
                        </div>
                        <div className="text-center text-white">
                          <h3 className="text-xl font-bold">{movie.title}</h3>
                          <p className="text-sm text-gray-300">{movie.genre}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
                        {movie.title}
                      </h3>
                      {activeFilters.provider === "TMDB" ? (
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-400">
                            {movie.release_date?.split("-")[0]}{" "}
                          </p>
                          <p className="text-sm text-gray-400 gap-7">
                            | {movie.vote_average?.toFixed(1)} ⭐
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          {movie.year} | {movie.runtime} min
                        </p>
                      )}
                    </div>
                    <Tooltip title="Add to Watchlist" arrow>
                      <button className="text-gray-400 hover:text-orange-500 transition-colors">
                        <FavoriteBorder />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
        </div>

        {movies && movies.length > 0 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              aria-label="Previous Page"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {generatePageNumbers().map((pageNum) => {
                if (pageNum === "..." || pageNum === "...") {
                  return (
                    <span key={pageNum + Math.random()} className="text-white">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum as number)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === pageNum
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default MoviesList;
