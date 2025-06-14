"use client";
import {
  Add,
  CalendarMonth,
  Category,
  FilterList,
  Remove,
  Sort,
} from "@mui/icons-material";
import { Chip } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import MoviesList from "./components/MovieList";
import { useAPIProvider } from "@/app/hooks/useAPIProvider";
import { useTranslations } from "next-intl";

export interface categoryOptions {
  id: string;
  name: string;
}

export interface activeFilters {
  quality: string | null;
  years: string | null;
  categories: categoryOptions[];
  orderBy: string | null;
  provider: string;
}

export default function Browse() {
  const t = useTranslations();
  const { APIProvider } = useAPIProvider();
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [activeFilters, setActiveFilters] = useState<activeFilters>({
    quality: null,
    years: null,
    orderBy: null,
    categories: [] as categoryOptions[],
    provider: APIProvider as string,
  });
  const [openSections, setOpenSections] = useState({
    quality: true,
    years: false,
    orderBy: false,
    categories: false,
    provider: false,
  });
  const [categoryOptions, setCategoryOptions] = useState<categoryOptions[]>([]);

  const qualityOptions = ["480p", "720p", "1080p", "2160p"];
  const yearOptions = ["2020", "2021", "2022", "2023", "2024"];
  const orderOptions = [t('browse.filters.ascending'), t('browse.filters.descending')];

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await fetch("/genres.json");
        if (!response.ok) throw new Error("Failed to fetch genres");
        const data = await response.json();
        setCategoryOptions(data.genres || []);
      } catch (err: any) {
        console.error("Error fetching genres:", err);
        toast.error("Could not load genre options.");
        setCategoryOptions([]);
      }
    };
    getGenres();
  }, []);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
  }, [
    activeFilters.quality,
    activeFilters.years,
    activeFilters.orderBy,
    activeFilters.categories,
    activeFilters.provider,
  ]);

  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      provider: APIProvider as string,
    }));
  }, [APIProvider]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (isLoading) return;

      if (page > 1 && !hasMore) {
        console.log("No more pages to fetch.");
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log(
        `Fetching page ${page} for provider ${activeFilters.provider}`
      );

      let newMovies: any[] = [];
      let newTotalPages: number = 1;
      let success = false;

      try {
        if (activeFilters.provider === "TMDB") {
          let baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/tmdb_movie_list?language=en-US&page=${page}&include_adult=false`;
          let url = baseUrl;
          if (activeFilters.quality) {
            console.warn(
              "TMDB quality filter is not directly supported in this API structure. Ignoring."
            );
          }
          if (activeFilters.years) {
            url += `&primary_release_year=${activeFilters.years}`;
          }
          if (activeFilters.categories.length > 0) {
            url += `&with_genres=${activeFilters.categories
              .map((category) => category.id)
              .join(",")}`;
          }
          if (activeFilters.orderBy) {
            activeFilters.orderBy === "Ascending"
              ? (url += "&sort_by=popularity.asc")
              : (url += "&sort_by=popularity.desc");
          }
          const response = await fetch(url, {
            credentials: "include",
          });
          if (!response.ok)
            throw new Error(`TMDB API Error: ${response.statusText}`);
          const data = await response.json();
          newMovies = data.movies?.results || [];
          newTotalPages = data.movies?.total_pages || 1;
          success = true;
        } else if (activeFilters.provider === "YTS") {
          let baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/yts_movie_list?page=${page}&limit=20`;
          let url = baseUrl;
          if (activeFilters.quality) {
            url += `&quality=${activeFilters.quality}`;
          }
          if (activeFilters.years) {
            url += `&query_term=${activeFilters.years}`;
          }
          if (activeFilters.categories.length > 0) {
            url += `&genre=${activeFilters.categories[0].name}`;
          }
          if (activeFilters.orderBy) {
            activeFilters.orderBy === "Ascending"
              ? (url += "&order_by=asc")
              : (url += "&order_by=desc");
          }
          const response = await fetch(url, {
            credentials: "include",
          });
          if (!response.ok)
            throw new Error(`YTS API Error: ${response.statusText}`);
          const data = await response.json();
          newMovies = data.data?.movies || [];
          const movieCount = data.data?.movie_count || 0;
          newTotalPages = Math.ceil(movieCount / 20) || 1;
          success = true;
        }

        if (success) {
          setMovies((prevMovies) =>
            page === 1 ? newMovies : [...prevMovies, ...newMovies]
          );
          setTotalPages(newTotalPages);
          setHasMore(page < newTotalPages && newMovies.length > 0);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error fetching movies: ${err.message}`);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeFilters, page]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (type: string, value: any) => {
    setActiveFilters((prev) => {
      let newFilters = { ...prev };
      if (type === "quality" || type === "years" || type === "orderBy") {
        newFilters = {
          ...prev,
          [type]: prev[type] === value ? null : value,
        };
      } else if (type === "categories") {
        const currentCategories = [...prev.categories];
        const index = currentCategories.findIndex(
          (filter) => filter.id === value.id
        );
        if (index === -1) {
          newFilters = {
            ...prev,
            categories: [...currentCategories, value],
          };
        } else {
          currentCategories.splice(index, 1);
          newFilters = {
            ...prev,
            categories: currentCategories,
          };
        }
      }
      return newFilters;
    });
  };

  const loadMoreItems = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log("Loading more items...");
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  return (
    <div className="min-h-screen max-w-[1500px] mx-auto text-white w-full flex flex-col mt-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-8">
        <div className="w-full space-y-6 lg:sticky top-20 h-max">
          {activeFilters.provider === "YTS" && (
            <div className="bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
                onClick={() => toggleSection("quality")}
              >
                <div className="flex items-center space-x-2">
                  <FilterList className="text-orange-500 group-hover:rotate-45 transition-transform" />
                  <h2 className="text-lg font-semibold">{t('browse.filters.quality')}</h2>
                </div>
                {openSections.quality ? (
                  <Remove className="text-orange-500" />
                ) : (
                  <Add className="text-orange-500" />
                )}
              </div>
              {openSections.quality && (
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {qualityOptions.map((quality) => (
                      <Chip
                        key={quality}
                        label={quality}
                        variant={
                          activeFilters.quality === quality
                            ? "filled"
                            : "outlined"
                        }
                        clickable
                        color="primary"
                        onClick={() => toggleFilter("quality", quality)}
                        className="transition-all duration-300 ease-in-out"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
              onClick={() => toggleSection("years")}
            >
              <div className="flex items-center space-x-2">
                <CalendarMonth className="text-orange-500 group-hover:scale-110 transition-transform" />
                <h2 className="text-lg font-semibold">{t('browse.filters.releaseYear')}</h2>
              </div>
              {openSections.years ? (
                <Remove className="text-orange-500" />
              ) : (
                <Add className="text-orange-500" />
              )}
            </div>
            {openSections.years && (
              <div className="p-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {yearOptions.map((year) => (
                    <Chip
                      key={year}
                      label={year}
                      variant={
                        activeFilters.years === year ? "filled" : "outlined"
                      }
                      clickable
                      color="secondary"
                      onClick={() => toggleFilter("years", year)}
                      className="transition-all duration-300 ease-in-out"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order By Filter */}
          <div className="bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
              onClick={() => toggleSection("orderBy")}
            >
              <div className="flex items-center space-x-2">
                <Sort className="text-orange-500 group-hover:rotate-180 transition-transform" />
                <h2 className="text-lg font-semibold">{t('browse.filters.orderBy')}</h2>
              </div>
              {openSections.orderBy ? (
                <Remove className="text-orange-500" />
              ) : (
                <Add className="text-orange-500" />
              )}
            </div>
            {openSections.orderBy && (
              <div className="p-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {orderOptions.map((order) => (
                    <Chip
                      key={order}
                      label={order}
                      variant={
                        activeFilters.orderBy === order ? "filled" : "outlined"
                      }
                      clickable
                      color="warning"
                      onClick={() => toggleFilter("orderBy", order)}
                      className="transition-all duration-300 ease-in-out"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories Filter */}
          <div className="bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
              onClick={() => toggleSection("categories")}
            >
              <div className="flex items-center space-x-2">
                <Category className="text-orange-500 group-hover:scale-110 transition-transform" />
                <h2 className="text-lg font-semibold">{t('browse.filters.categories')}</h2>
              </div>
              {openSections.categories ? (
                <Remove className="text-orange-500" />
              ) : (
                <Add className="text-orange-500" />
              )}
            </div>
            {openSections.categories && categoryOptions.length > 0 && (
              <div className="p-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category: categoryOptions) => (
                    <Chip
                      key={category.id as string}
                      label={category.name as string}
                      variant={
                        activeFilters.categories.find(
                          (cat) => cat.id === category.id
                        )
                          ? "filled"
                          : "outlined"
                      }
                      clickable
                      color="success"
                      onClick={() => toggleFilter("categories", category)}
                      className="transition-all duration-300 ease-in-out"
                    />
                  ))}
                </div>
              </div>
            )}
            {openSections.categories && categoryOptions.length === 0 && (
              <p className="p-4 text-gray-400">
                {t('browse.filters.loadingCategories')}
              </p>
            )}
          </div>
        </div>

        <MoviesList
          movies={movies}
          hoveredMovie={hoveredMovie}
          setHoveredMovie={setHoveredMovie}
          activeFilters={activeFilters}
          isLoading={isLoading && page === 1}
          loadMoreItems={loadMoreItems}
          hasMore={hasMore}
          isFetchingMore={isLoading && page > 1}
        />
      </div>
    </div>
  );
}
