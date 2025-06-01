"use client";

import React, { useRef, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { activeFilters } from "../page";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: any[];
  hoveredMovie: number | null;
  setHoveredMovie: (id: number | null) => void;
  activeFilters: activeFilters;
  isLoading: boolean;
  loadMoreItems: () => void;
  hasMore: boolean;
  isFetchingMore: boolean;
}

const MoviesList: React.FC<MovieListProps> = ({
  movies,
  hoveredMovie,
  setHoveredMovie,
  activeFilters,
  isLoading,
  loadMoreItems,
  hasMore,
  isFetchingMore,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingMore || isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });

      if (node) observer.current.observe(node); // Observe the new node
    },
    [isFetchingMore, isLoading, hasMore, loadMoreItems]
  );

  if (isLoading) {
    // Initial loading state (page 1)
    return (
      <div className="lg:col-span-3 flex justify-center items-center min-h-[50vh]">
        <CircularProgress color="primary" size={60} />
        <p className="ml-4 text-xl">Loading Movies...</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="lg:col-span-3 flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-400">
          No movies found for the selected filters. Try adjusting your search!
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <div
                ref={lastMovieElementRef}
                key={`${movie.id}-${index}-${activeFilters.provider}`}
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <MovieCard
                  movie={movie}
                  isHovered={hoveredMovie === movie.id}
                  provider={activeFilters.provider}
                />
              </div>
            );
          }
          return (
            <div
              key={`${movie.id}-${index}-${activeFilters.provider}`}
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <MovieCard
                movie={movie}
                isHovered={hoveredMovie === movie.id}
                provider={activeFilters.provider}
              />
            </div>
          );
        })}
      </div>

      {isFetchingMore && (
        <div className="flex justify-center items-center py-8">
          <CircularProgress color="secondary" size={40} />
          <p className="ml-3 text-lg">Loading more...</p>
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the list!</p>
        </div>
      )}
    </div>
  );
};

export default MoviesList;
