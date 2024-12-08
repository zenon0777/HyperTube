"use client";
import { useState } from "react";
import NavBar from "@/app/components/NavBar/NavBar";
import {
  Add,
  Remove,
  FilterList,
  Sort,
  CalendarMonth,
  Category,
  PlayCircle,
  InfoOutlined,
  StarBorder,
} from "@mui/icons-material";
import { Button, Chip, Tooltip } from "@mui/material";

export default function Browse() {
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    quality: [],
    years: [],
    orderBy: null,
    categories: [],
  });
  const [openSections, setOpenSections] = useState({
    quality: true,
    years: false,
    orderBy: false,
    categories: false,
  });

  const qualityOptions = ["480p", "720p", "1080p", "4K"];
  const yearOptions = ["2020", "2021", "2022", "2023", "2024"];
  const orderOptions = ["Ascending", "Descending"];
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

  const movies = [
    {
      id: 1,
      title: "Spider-Man: No Way Home",
      year: 2021,
      duration: "2 hours 28 minutes",
      genre: "Sci-fi, Action",
      description:
        "Peter Parker seeks Doctor Strange's help to make people forget about his identity, but things take a wild turn.",
      background: "/imk.jpeg",
      poster: "/imk.jpeg",
    },
    {
      id: 2,
      title: "DAIFI-2: No Way Home",
      year: 2021,
      duration: "2 hours 28 minutes",
      genre: "Sci-fi, Action",
      description:
        "Peter Parker seeks Doctor Strange's help to make people forget about his identity, but things take a wild turn.",
      background: "/imk.jpeg",
      poster: "/imk.jpeg",
    },
    {
      id: 3,
      title: "DAIFI-3: No Way Home",
      year: 2021,
      duration: "2 hours 28 minutes",
      genre: "Sci-fi, Action",
      description:
        "Peter Parker seeks Doctor Strange's help to make people forget about his identity, but things take a wild turn.",
      background: "/imk.jpeg",
      poster: "/imk.jpeg",
    },

    // Add other movies here...
  ];

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (type, value) => {
    if (type === "orderBy") {
      // For order, it's a single selection
      setActiveFilters((prev) => ({
        ...prev,
        orderBy: prev.orderBy === value ? null : value,
      }));
    } else {
      // For quality, years, and categories, allow multiple selections
      setActiveFilters((prev) => {
        const currentFilters = prev[type];
        const newFilters = currentFilters.includes(value)
          ? currentFilters.filter((f) => f !== value)
          : [...currentFilters, value];

        return {
          ...prev,
          [type]: newFilters,
        };
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex flex-col">
      <div className="max-w-screen-2xl mx-auto text-white w-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 left-0 w-full px-4 py-4 flex justify-between items-center bg-black/60 backdrop-blur-sm z-50">
          <NavBar />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-8">
          <div className="col-span-1 space-y-6 sticky top-20">
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
                          activeFilters.quality.includes(quality)
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
                          activeFilters.years.includes(year)
                            ? "filled"
                            : "outlined"
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
                    {categoryOptions.map((category) => (
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
              {activeFilters.quality.length > 0 && (
                <span className="ml-4 text-sm text-gray-400">
                  Quality: {activeFilters.quality.join(", ")}
                </span>
              )}
              {activeFilters.years.length > 0 && (
                <span className="ml-4 text-sm text-gray-400">
                  Years: {activeFilters.years.join(", ")}
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
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={movie.poster}
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

                  {/* Movie Details */}
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {movie.year} • {movie.duration.split(" ")[0]} hrs
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
