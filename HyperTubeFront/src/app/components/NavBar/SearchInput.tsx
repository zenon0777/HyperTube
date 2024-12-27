import { Divider } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface MovieResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  medium_cover_image?: string;
  media_type?: string;
  year?: number;
}

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<"yts" | "tmdb" | "">("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [tmdbList, setTmdbList] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  useEffect(() => {
    const searchForMovie = async () => {
      if (!search || !provider) return;

      setIsLoading(true);
      setIsResultsVisible(true);
      try {
        let res;
        let data;

        switch (provider) {
          case "yts":
            res = await fetch(
              `http://0.0.0.0:8000/movies/yts_movie_list?query_term=${search}&limit=5`
            );
            if (!res.ok) throw new Error("No movies found on YTS");
            data = await res.json();
            setResults(data.data?.movies || []);
            break;

          case "tmdb":
            res = await fetch(
              `http://0.0.0.0:8000/movies/tmdb_multi_search?query=${search}`
            );
            if (!res.ok) throw new Error("No movies found on TMDB");
            data = await res.json();
            setResults(data.movies?.results || []);
            break;

          default:
            throw new Error("Invalid provider");
        }
      } catch (error: any) {
        toast.error(error.message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (provider && search) {
      searchForMovie();
    }
  }, [provider, search]);

  useEffect(() => {
    if (provider === "tmdb") {
      const movieResults = results.filter(
        (result) => result.media_type === "movie" || result.media_type === "tv"
      );
      setTmdbList(movieResults);
    } else {
      setTmdbList([]);
    }
  }, [results, provider]);

  const renderResultItem = (result: MovieResult, index: number) => {
    const title = result.title || result.name || "Unknown Title";
    const posterUrl =
      provider === "yts"
        ? result.medium_cover_image
        : result.poster_path &&
          `https://image.tmdb.org/t/p/w300${result.poster_path}`;
    const year = result.year || "N/A";

    return (
      <div
        key={`${result.id}-${index}`}
        className="flex items-center gap-3 p-2 hover:bg-gray-700 transition-colors duration-200 cursor-pointer group"
        onClick={() => {
          // TODO: Add selection logic
          setIsResultsVisible(false);
        }}
      >
        {posterUrl && (
          <Image
            width={40}
            height={60}
            className="rounded-md object-cover group-hover:scale-105 transition-transform"
            src={posterUrl}
            alt={title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.png";
            }}
          />
        )}
        <div className="flex-grow">
          <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">
            {title}
          </p>
          <p className="text-gray-400 text-xs">{year}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 text-xs">
          Select
        </div>
      </div>
    );
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    setIsResultsVisible(true);
  };

  const displayResults = provider === "yts" ? results : tmdbList;

  return (
    <div className="flex items-start gap-4 relative lg:w-72 w-full">
      <div className="flex items-center gap-4 relative w-60">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            className="w-full bg-gray-700 bg-opacity-60 placeholder:text-start placeholder:text-white text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
            onChange={(e) => {
              setSearch(e.target.value);
              setIsResultsVisible(true);
            }}
            onKeyDown={handleSearch}
            onFocus={() => {
              if (displayResults.length > 0) setIsResultsVisible(true);
            }}
          />

          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
              <div className="animate-spin w-5 h-5 border-2 border-t-orange-500 border-gray-200 rounded-full"></div>
            </div>
          )}

          {!isLoading && isResultsVisible && displayResults.length > 0 && (
            <div 
              className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 border border-gray-700"
              onBlur={() => setIsResultsVisible(false)}
            >
              {displayResults.map(renderResultItem)}
              {displayResults.length === 0 && (
                <div className="text-center text-gray-400 p-4">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className={`px-2 py-2 rounded-full transition-all duration-300 ${
            provider === "tmdb"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white"
          }`}
          onClick={() => setProvider("tmdb")}
          disabled={isLoading}
        >
          TMDB
        </button>
        <button
          className={`px-2 py-2 rounded-full transition-all duration-300 ${
            provider === "yts"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white"
          }`}
          onClick={() => setProvider("yts")}
          disabled={isLoading}
        >
          YTS
        </button>
      </div>
    </div>
  );
}