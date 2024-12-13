"use client";
import { useEffect, useState } from "react";
import NavBar from "@/app/components/NavBar/NavBar";
import {
  Add,
  CalendarMonth,
  Category,
  FilterList,
  InfoRounded,
  PlayCircle,
  Remove,
  Sort,
  StarBorder,
} from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

export default function Browse() {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [movies, setMovies] = useState<any>([]);

  const [activeFilters, setActiveFilters] = useState({
    quality: null,
    years: null,
    orderBy: null,
    categories: [],
  });
  const [openSections, setOpenSections] = useState({
    quality: true,
    years: false,
    orderBy: false,
    categories: false,
  });

  const qualityOptions = ["480p", "720p", "1080p", "2160p"];
  const yearOptions = ["2020", "2021", "2022", "2023", "2024"];
  const orderOptions = ["asc", "desc"];
  const categoryOptions = [
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Thriller",
    "Documentary",
    "Animation",
    "Romance",
    "Horror",
    "Adventure",
  ];

  useEffect(() => {
    const getFiltredMovies = async () => {
      // Fetch movies based on active filters
      let baseUrl ="https://yts.mx/api/v2/list_movies.json/?limit=15";
      let url = baseUrl;
      if (activeFilters.quality.length > 0) {
        url += `&quality=${activeFilters.quality.join(",")}`;
      }
      if (activeFilters.years.length > 0) {
        url += `&query_term=${activeFilters.years.join(",")}`;
      }
      if (activeFilters.categories.length > 0) {
        url += `&categories=${activeFilters.categories.join(",")}`;
      }
      if (activeFilters.orderBy) {
        url += `&orderBy=${activeFilters.orderBy}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.data.movies);
      console.log(data);
    }
    getFiltredMovies();
  }, [activeFilters]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (type, value) => {
    setActiveFilters((prev) => {
      // For quality, years, and order, only allow one selection at a time
      if (type === "quality" || type === "years" || type === "orderBy") {
        return {
          ...prev,
          [type]: prev[type] === value ? null : value,
        };
      }

      // For categories, allow multiple selections
      if (type === "categories") {
        const currentFilters = prev.categories;
        const newFilters = currentFilters.includes(value)
          ? currentFilters.filter((f) => f !== value)
          : [...currentFilters, value];

        return {
          ...prev,
          categories: newFilters,
        };
      }

      return prev;
    });
  };

  useEffect(() => {
    const filteredMovies = async () => {
      try {
        let baseUrl = "https://yts.mx/api/v2/list_movies.json/?limit=15";
        let filterUrl = "";
        if (activeFilters.quality) {
          activeFilters.quality === "4K"
            ? (baseUrl += `&quality=2160p`)
            : (baseUrl += `&quality=${activeFilters.quality}`);
        }

        if (activeFilters.years) {
          baseUrl += `&query_term=${activeFilters.years}`;
        }

        if (activeFilters.categories.length > 0) {
          baseUrl += `&genre=${activeFilters.categories.join(",")}`;
        }

        if (activeFilters.orderBy) {
          activeFilters.orderBy === "Ascending"
            ? (baseUrl += "&order_by=asc")
            : (baseUrl += "&order_by=desc");
        }

        const response = await fetch(baseUrl);
        const data = await response.json();
        setMovies(data.data.movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    filteredMovies();
  }, [activeFilters]);

  useEffect(() => {
    const getMovies = async () => {
      const response = await fetch(
        "https://yts.mx/api/v2/list_movies.json/?limit=15"
      );
      const data = await response.json();
      console.log("yoyo ; ", data);
      setMovies(data.data.movies);
    };
    getMovies();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex flex-col">
      <div className="max-w-screen-2xl mx-auto text-white w-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 left-0 w-full px-4 py-4 flex justify-between items-center bg-black/60 backdrop-blur-sm z-50">
          <NavBar />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-8">
          <div className="col-span-1 space-y-6 sticky top-20">
            {/* Quality Filter */}
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

            {/* Release Year Filter */}
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

            {/* Order By Filter */}
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
                          activeFilters.orderBy === order
                            ? "filled"
                            : "outlined"
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
                    {categoryOptions.map((category: string) => (
                      <Chip
                        key={category}
                        label={category}
                        variant={
                          activeFilters.categories.includes(category)
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

          {/* Content Area */}
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
                  Categories: {activeFilters.categories.join(", ")}
                </span>
              )}
              {activeFilters.orderBy && (
                <span className="ml-4 text-sm text-gray-400">
                  Order: {activeFilters.orderBy}
                </span>
              )}
            </h1>

            {/* Placeholder for content grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie:any) => (
                <div
                  key={movie.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={movie.large_cover_image}
                      alt={movie.title}
                      className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay for Hovered State */}
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
                              <InfoRounded fontSize="large" />
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

                  {/* Movie Details */}
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {movie.year} • {movie.runtime} min
                      </p>
                    </div>
                    <Tooltip title="Add to Watchlist" arrow>
                      <button className="text-gray-400 hover:text-orange-500 transition-colors">
                        <StarBorder />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
