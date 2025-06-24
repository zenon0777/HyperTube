"use client";

import React, { useRef, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { ActiveFilters } from "../page";
import MovieCard from "./MovieCard";
import { useTranslations } from "next-intl";

interface MovieData {
  // TMDB fields
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
}

interface MovieListProps {
  movies: MovieData[];
  hoveredMovie: number | null;
  setHoveredMovie: (id: number | null) => void;
  activeFilters: ActiveFilters;
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

  const t = useTranslations();

  if (isLoading) {
    // Initial loading state (page 1)
    return (
      <div className="lg:col-span-3 flex justify-center items-center min-h-[50vh]">
        <CircularProgress color="primary" size={60} />
        <p className="ml-4 text-xl">{t('browse.loading.movies')}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="lg:col-span-3 flex flex-col justify-center items-center min-h-[50vh] text-center px-4">
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">
          {t('browse.noResults.title')}
        </h3>
        <p className="text-lg text-gray-400">
          {t('browse.noResults.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => {
          const movieId = typeof movie.id === 'number' ? movie.id : null;
          
          if (movies.length === index + 1) {
            return (
              <div
                ref={lastMovieElementRef}
                key={`${movie.id}-${index}-${activeFilters.provider}`}
                onMouseEnter={() => setHoveredMovie(movieId)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <MovieCard
                  movie={movie}
                  isHovered={hoveredMovie === movieId}
                  provider={activeFilters.provider}
                />
              </div>
            );
          }
          return (
            <div
              key={`${movie.id}-${index}-${activeFilters.provider}`}
              onMouseEnter={() => setHoveredMovie(movieId)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <MovieCard
                movie={movie}
                isHovered={hoveredMovie === movieId}
                provider={activeFilters.provider}
              />
            </div>
          );
        })}
      </div>

      {isFetchingMore && (
        <div className="flex justify-center items-center py-8">
          <CircularProgress color="secondary" size={40} />
          <p className="ml-3 text-lg">{t('browse.loading.more')}</p>
        </div>
      )}

      {!hasMore && movies.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{t('browse.loading.endOfList')}</p>
        </div>
      )}
    </div>
  );
};

export default MoviesList;
