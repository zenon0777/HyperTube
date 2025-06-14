import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import debounce from "lodash.debounce";
import { LuLoader } from "react-icons/lu";
import { SearchOffOutlined } from "@mui/icons-material";
import { AiFillX } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAPIProvider } from "@/app/hooks/useAPIProvider";
import { useTranslations } from "next-intl";

interface MovieResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  medium_cover_image?: string;
  media_type?: string;
  year?: number;
  release_date?: string;
}

export default function SearchInput() {
  const t = useTranslations("searchInput");
  const { APIProvider, isYTS } = useAPIProvider();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm || !APIProvider) return;

      setIsLoading(true);
      try {
        const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/`;
        const endpoints = {
          YTS: `${baseUrl}yts_movie_list?query_term=${searchTerm}&limit=5`,
          TMDB: `${baseUrl}tmdb_multi_search?query=${searchTerm}`,
        };

        const res = await fetch(
          endpoints[APIProvider as keyof typeof endpoints],
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error(`No movies found on ${APIProvider}`);

        const data = await res.json();
        console.log("search data ====> ::: ", data);
        isYTS
          ? setResults(data.data?.movies)
          : setResults(data.movies?.results);
      } catch (error: any) {
        console.log("error ====> ::: ", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [APIProvider]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isResultsVisible || results.length === 0) return;

      if (event.key === "ArrowDown") {
        setActiveIndex((prev) =>
          prev === null || prev >= results.length - 1 ? 0 : prev + 1
        );
      } else if (event.key === "ArrowUp") {
        setActiveIndex((prev) =>
          prev === null || prev <= 0 ? results.length - 1 : prev - 1
        );
      } else if (event.key === "Enter" && activeIndex !== null) {
        const selectedResult = results[activeIndex];
        toast.success(
          `Selected: ${selectedResult.title || selectedResult.name}`
        );
        setIsResultsVisible(false);
      } else if (event.key === "Escape") {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isResultsVisible, results, activeIndex]);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
      setIsResultsVisible(true);
    } else {
      setResults([]);
      setIsResultsVisible(false);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, debouncedSearch]);

  const renderResultItem = (result: MovieResult, index: number) => {
    const title = result.title ? result.title : result.name || t("Unknown Title");
    const posterUrl =
      isYTS
        ? result.medium_cover_image
        : (result.poster_path &&
            `https://image.tmdb.org/t/p/w300${result.poster_path}`) ||
          `https://via.placeholder.com/300x450?text=${title}`;
    const year = result.year
      ? result.year
      : result?.release_date?.split("-")[0];

    const id = result.id;

    const isActive = index === activeIndex;
    return (
      <div
        key={`${result.id}-${index}`}
        className={`flex w-auto items-center gap-3 p-3 cursor-pointer border-b border-gray-700/50 last:border-b-0 transition-all ${
          isActive ? "bg-gray-700 text-orange-400" : "hover:bg-gray-700/50"
        }`}
        onClick={() => {
          router.push(`/browse/movie/${id}`);
          setSearch("");
          setIsResultsVisible(false);
        }}
      >
        <div className="relative w-12 h-16 flex-shrink-0">
          <Image
            fill
            sizes="100px"
            className="rounded-md object-cover"
            src={posterUrl || "/placeholder-image.png"}
            alt={title}
          />
        </div>
        <div className="flex-grow w-auto">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs mt-1">{year}</p>
        </div>
      </div>
    );
  };

  const displayResults = results;

  return (
    <div className="relative w-auto md:w-96 lg:w-80 xl:w-96">
      <div className="relative">
        <SearchOffOutlined className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={t("placeholder")}
          value={search}
          className="w-full bg-gray-800 text-white pl-10 pr-10 py-2.5 rounded-lg placeholder:text-gray-400 ring-2 ring-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <AiFillX className="w-4 h-4" />
          </button>
        )}
      </div>

      {isResultsVisible && (
        <div
          ref={resultsRef}
          className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-[30vh] overflow-y-auto border border-gray-700/50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <LuLoader className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : displayResults.length > 0 ? (
            displayResults.map(renderResultItem)
          ) : (
            <div className="text-center text-gray-400 p-4">
              {t("noResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
