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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import MoviesList from "./components/MovieList";

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
  const APIProvider = useSelector(
    (state: any) => state.APIProviderSlice.APIProvider
  );
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [movies, setMovies] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
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
  const [categoryOptions, setCategoryOptions] = useState<categoryOptions[]>([
    { id: "", name: "" },
  ]);

  const qualityOptions = ["480p", "720p", "1080p", "2160p"];
  const yearOptions = ["2020", "2021", "2022", "2023", "2024"];
  const orderOptions = ["Ascending", "descending"];

  useEffect(() => {
    const getGenres = async () => {
      const response = await fetch("/genres.json");
      const data = await response.json();
      setCategoryOptions(data.genres);
    };
    getGenres();
  }, []);

  useEffect(() => {
    const getTMDBFiltredMovies = async () => {
      let baseUrl = `http://0.0.0.0:8000/movies/tmdb_movie_list?&language=en-US&page=${page}&include_adult=false`;
      let url = baseUrl;
      if (activeFilters.quality) {
        url += `&quality=${activeFilters.quality}`;
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
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setTotalPages(data.movies?.total_pages);
      setMovies(data.movies?.results);
      console.log(movies.length);
    };
    const getYTSFiltredMovies = async () => {
      try {
        let baseUrl = `http://0.0.0.0:8000/movies/yts_movie_list?page=${page}&limit=20`;
        let url = baseUrl;
        if (activeFilters.quality) {
          url += `&quality=${activeFilters.quality}`;
        }
        if (activeFilters.years) {
          url += `&query_term=${activeFilters.years}`;
        }
        if (activeFilters.categories) {
          url += `&genre=${activeFilters.categories
            .map((category) => category.name)
            .join(",")}`;
        }
        if (activeFilters.orderBy) {
          activeFilters.orderBy === "Ascending"
            ? (url += "&order_by=asc")
            : (url += "&order_by=desc");
        }
        const response = await fetch(url);
        const data = await response.json();
        let np = data.data.movie_count / 20;
        setTotalPages(Number(np.toFixed(0)));
        setMovies(data.data?.movies);
      } catch (error: any) {
        setError(error.message);
        toast.error("hello");
      }
    };
    activeFilters.provider === "TMDB"
      ? getTMDBFiltredMovies()
      : getYTSFiltredMovies();

    console.log("Provider ----> :  ", activeFilters.provider);
  }, [activeFilters, page]);

  useEffect(() => {
    console.log("Provider ID : ===> : ", APIProvider);
    setActiveFilters((prev) => ({
      ...prev,
      provider: APIProvider,
    }));
  }, [APIProvider]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (type: string, value: any) => {
    setActiveFilters((prev) => {
      if (type === "quality" || type === "years" || type === "orderBy") {
        return {
          ...prev,
          [type]: prev[type] === value ? null : value,
        };
      }

      if (type === "categories") {
        const currentFilters = prev.categories;
        const index = currentFilters.findIndex(
          (filter) => filter.id === value.id
        );
        if (index === -1) {
          return {
            ...prev,
            categories: [...currentFilters, value],
          };
        }
        currentFilters.splice(index, 1);
        return {
          ...prev,
          categories: currentFilters,
        };
      }

      return prev;
    });
  };

  return (
    <div className="min-h-screen max-w-[1500px] mx-auto text-white w-full flex flex-col mt-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-8">
        <div className="w-full space-y-6 sticky top-20">
          {/* Quality Filter */}
          {activeFilters.provider === "YTS" && (
            <div className="bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
                onClick={() => toggleSection("quality")}
              >
                <div className="flex items-center space-x-2">
                  <FilterList className="text-orange-500 group-hover:rotate-45 transition-transform" />
                  <h2 className="text-lg font-semibold">Quality</h2>
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
                <h2 className="text-lg font-semibold">Release Year</h2>
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
                      color="secondary"
                      onClick={() => toggleFilter("years", year)}
                      className="transition-all duration-300 ease-in-out"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors group"
              onClick={() => toggleSection("orderBy")}
            >
              <div className="flex items-center space-x-2">
                <Sort className="text-orange-500 group-hover:rotate-180 transition-transform" />
                <h2 className="text-lg font-semibold">Order By</h2>
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
                <h2 className="text-lg font-semibold">Categories</h2>
              </div>
              {openSections.categories ? (
                <Remove className="text-orange-500" />
              ) : (
                <Add className="text-orange-500" />
              )}
            </div>

            {openSections.categories && (
              <div className="p-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category: any) => (
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
                      color="success"
                      onClick={() => toggleFilter("categories", category)}
                      className="transition-all duration-300 ease-in-out"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <MoviesList
          movies={movies}
          hoveredMovie={hoveredMovie}
          setHoveredMovie={setHoveredMovie}
          activeFilters={activeFilters}
          isLoading={!movies || !movies.length}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </div>
    </div>
  );
}
