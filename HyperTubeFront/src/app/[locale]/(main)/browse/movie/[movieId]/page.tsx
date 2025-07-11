"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  MdOutlineFavorite,
  MdMovie,
  MdStar,
  MdAccessTime,
  MdInfoOutline,
  MdLink,
  MdVideocam,
  MdCloudDownload,
  MdPhotoLibrary,
  MdOutlineFavoriteBorder,
} from "react-icons/md";
import { FaTicketAlt, FaUsers, FaYoutube } from "react-icons/fa";
import { TbLanguage, TbMagnet } from "react-icons/tb";
import { useEffect, useState } from "react";
import { BiCameraMovie, BiSolidMoviePlay } from "react-icons/bi";
import { HiOutlineCollection } from "react-icons/hi";
import { BsLightningChargeFill, BsSpeedometer2 } from "react-icons/bs";
import CommentsSection from "./components/MovieComments";
import { RootState, AppDispatch } from "@/app/store";
import { getUserProfile } from "@/app/store/userSlice";
import { useAPIProvider } from "@/app/hooks/useAPIProvider";
import { getTorrentHashForTMDBMovie } from "@/api/torrent/torrentHelper";
import {
  getFirstNon3DTorrent,
  filterOut3DTorrents,
} from "@/utils/torrentUtils";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";

const formatRuntime = (minutes: number | undefined | null) => {
  if (minutes === undefined || minutes === null || minutes <= 0) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

interface MovieDetails {
  id: number;
  title?: string;
  title_english?: string;
  description_full?: string;
  overview?: string;
  description_intro?: string;
  year?: number;
  release_date?: string;
  tagline?: string;
  runtime?: number;
  rating?: number;
  vote_average?: number;
  backdrop_path?: string;
  poster_path?: string;
  background_image_original?: string;
  large_cover_image?: string;
  medium_cover_image?: string;
  genres?: string[] | Array<{ name: string }>;
  spoken_languages?: Array<{ english_name?: string; name: string }>;
  language?: string;
  yt_trailer_code?: string;
  videos?: {
    results: Array<{
      type: string;
      official: boolean;
      site: string;
      key: string;
    }>;
  };
  torrents?: Array<{
    hash: string;
    quality: string;
    type?: string;
    size?: string;
    seeds?: number;
    peers?: number;
    [key: string]: unknown;
  }>;
  cast?: Array<{
    imdb_code?: string;
    id?: number;
    name: string;
    character_name?: string;
    character?: string;
    url_small_image?: string;
    profile_path?: string;
  }>;
  images?: {
    backdrops: Array<{ file_path: string }>;
    logos: Array<{ file_path: string; iso_639_1?: string }>;
  };
  similar_movies?: Array<MovieDetails> | { results: Array<MovieDetails> };
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path?: string;
  }>;
  belongs_to_collection?: {
    name: string;
    poster_path?: string;
  };
  original_title?: string;
  status?: string;
  mpa_rating?: string;
  budget?: number;
  revenue?: number;
  production_countries?: Array<{ name: string }>;
  imdb_id?: string;
  imdb_code?: string;
  homepage?: string;
  url?: string;
  like_count?: number;
  medium_screenshot_image1?: string;
  medium_screenshot_image2?: string;
  medium_screenshot_image3?: string;
  large_screenshot_image1?: string;
  large_screenshot_image2?: string;
  large_screenshot_image3?: string;
}

export default function Movie() {
  const t = useTranslations("movie");
  const { APIProvider, isYTS } = useAPIProvider();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { movieId } = useParams();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [torrentHash, setTorrentHash] = useState<string | null>(null);
  const [isLoadingTorrent, setIsLoadingTorrent] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!APIProvider || !movieId) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setIsError(false);
      setDetails(null);
      setTorrentHash(null);
      setIsLoadingTorrent(false);

      const baseUrl =
        isYTS === true
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/yts_movie_detail`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/tmdb_movie_detail`;

      const queryParams = new URLSearchParams({ movie_id: movieId as string });

      const fullUrl =
        isYTS === true
          ? `${baseUrl}?${queryParams.toString()}`
          : `${baseUrl}/${movieId}`;

      try {
        const response = await api.get(fullUrl);
        const data = response.data;
        if (data?.movie) {
          setDetails(data.movie);
        } else throw new Error("Movie data not found in response");
        setIsError(false);
      } catch {
        setIsError(true);
        setDetails(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [APIProvider, movieId, isYTS]);

  useEffect(() => {
    const fetchTorrentHash = async () => {
      if (
        APIProvider !== "YTS" &&
        details &&
        !isLoadingTorrent &&
        !torrentHash
      ) {
        setIsLoadingTorrent(true);
        try {
          const hash = await getTorrentHashForTMDBMovie(
            details as unknown as Record<string, unknown>
          );
          setTorrentHash(hash);
        } catch {
          toast.error("Could not load torrent hash.");
          setTorrentHash(null);
        } finally {
          setIsLoadingTorrent(false);
        }
      }
    };

    fetchTorrentHash();
  }, [APIProvider, details, isLoadingTorrent, torrentHash]);

  const getTitle = () => details?.title_english || details?.title || "Untitled";
  const getOverview = () =>
    details?.description_full ||
    details?.overview ||
    details?.description_intro ||
    "No overview available.";
  const getYear = () =>
    details?.year || details?.release_date?.split("-")[0] || "N/A";
  const getTagline = () => details?.tagline || null;

  const getBestTrailerUrl = (): string | null => {
    if (APIProvider === "YTS" && details?.yt_trailer_code) {
      return `https://www.youtube.com/embed/${details.yt_trailer_code}`;
    }
    if (
      APIProvider !== "YTS" &&
      details?.videos?.results &&
      details.videos.results.length > 0
    ) {
      const videos = details.videos.results;
      const officialTrailer = videos.find(
        (v) => v.type === "Trailer" && v.official && v.site === "YouTube"
      );
      if (officialTrailer)
        return `https://www.youtube.com/embed/${officialTrailer.key}`;
      const officialTeaser = videos.find(
        (v) => v.type === "Teaser" && v.official && v.site === "YouTube"
      );
      if (officialTeaser)
        return `https://www.youtube.com/embed/${officialTeaser.key}`;
      const anyOfficialVideo = videos.find(
        (v) => v.official && v.site === "YouTube"
      );
      if (anyOfficialVideo)
        return `https://www.youtube.com/embed/${anyOfficialVideo.key}`;
      const anyTrailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (anyTrailer) return `https://www.youtube.com/embed/${anyTrailer.key}`;
      const firstYouTubeVideo = videos.find((v) => v.site === "YouTube");
      if (firstYouTubeVideo)
        return `https://www.youtube.com/embed/${firstYouTubeVideo.key}`;
    }
    return null;
  };

  const getGenres = () => {
    if (details?.genres && Array.isArray(details.genres)) {
      if (APIProvider === "YTS") return details.genres.join(", ");
      return details.genres
        .map((g) => (typeof g === "string" ? g : g.name))
        .join(", ");
    }
    return "N/A";
  };
  const getRating = () => {
    const rating = details?.rating ?? details?.vote_average;
    if (typeof rating === "number") return `${rating.toFixed(1)}/10`;
    return "N/A";
  };
  const getBackdropUrl = () => {
    if (APIProvider !== "YTS" && details?.backdrop_path)
      return `${TMDB_IMAGE_BASE_URL}original${details.backdrop_path}`;
    if (APIProvider === "YTS" && details?.background_image_original)
      return details.background_image_original;
    if (APIProvider === "YTS" && details?.large_cover_image)
      return details.large_cover_image;
    if (APIProvider !== "YTS" && details?.poster_path)
      return `${TMDB_IMAGE_BASE_URL}original${details.poster_path}`;
    return `https://placehold.co/600x400.png`;
  };
  const getPosterUrl = (size: string = "w500") => {
    if (APIProvider !== "YTS" && details?.poster_path)
      return `${TMDB_IMAGE_BASE_URL}${size}${details.poster_path}`;
    if (APIProvider === "YTS" && details?.large_cover_image)
      return details.large_cover_image;
    return `https://placehold.co/600x400.png`;
  };
  const getSmallCoverImage = (movie: MovieDetails) => {
    if (APIProvider === "YTS" && movie?.medium_cover_image)
      return movie.medium_cover_image;
    if (APIProvider !== "YTS" && movie?.poster_path)
      return `${TMDB_IMAGE_BASE_URL}w342${movie.poster_path}`;
    return `https://placehold.co/600x400.png`;
  };

  const getSpokenLanguages = () => {
    if (
      APIProvider !== "YTS" &&
      details?.spoken_languages &&
      details.spoken_languages.length > 0
    ) {
      return details.spoken_languages
        .map((lang) => lang.english_name || lang.name)
        .filter(Boolean)
        .join(", ");
    }
    if (APIProvider === "YTS" && details?.language) {
      const langMap: { [key: string]: string } = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        ja: "Japanese",
        ko: "Korean",
        hi: "Hindi",
        ru: "Russian",
        iu: "Inuktitut",
      };
      return (
        langMap[details.language.toLowerCase()] ||
        details.language.toUpperCase()
      );
    }
    return "N/A";
  };

  const getSimilarMoviesArray = (): MovieDetails[] => {
    if (!details?.similar_movies) return [];
    if (Array.isArray(details.similar_movies)) {
      return details.similar_movies;
    }
    return details.similar_movies.results || [];
  };

  const hasSimilarMovies = (): boolean => {
    const movies = getSimilarMoviesArray();
    return movies.length > 0;
  };

  const markAsWatched = async (movie_id: string) => {
    try {
      await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/mark_as_watched/${movie_id}`,
        {
          movie_id: movie_id,
        }
      );
      toast.success("Movie marked as watched!");
    } catch (error) {
      console.error("Error marking movie as watched:", error);
      toast.error("Failed to mark movie as watched.");
    }
  };

  useEffect(() => {
    const isWatched = async () => {
      try {
        if (!movieId) return;
        const response = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/is_watched/${movieId}/`
        );
        const data = await response.data;
        setIsWatched(data.is_watched);
      } catch (error) {
        console.error("Error checking if movie is watched:", error);
      }
    };
    isWatched();
  }, [movieId]);

  const bestTrailerUrl = getBestTrailerUrl();
  const title = getTitle();
  const tagline = getTagline();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-xl">{t("loading")}</p>
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center">
        <MdInfoOutline className="text-6xl text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">{t("error")}</h1>
        <p className="text-lg text-gray-400">{t("errorDescription")}</p>
        {APIProvider && movieId && (
          <button
            onClick={() =>
              typeof window !== "undefined" && window.location.reload()
            }
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition transform hover:scale-105 active:scale-95"
          >
            {" "}
            {t("tryAgain")}{" "}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white w-full flex flex-col">
      <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={getBackdropUrl()}
            alt={`${title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent opacity-90"></div>
        </motion.div>
        <div className="relative z-10 h-full flex items-end pb-10 md:pb-20 px-4 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="w-full md:w-3/4 lg:w-2/3"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-Lemonada font-bold mb-2 text-white filter drop-shadow-lg"
            >
              {" "}
              {title}{" "}
            </motion.h1>
            {tagline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="text-lg sm:text-xl lg:text-2xl italic text-gray-300 mb-3 sm:mb-4 filter drop-shadow-md"
              >
                {" "}
                {tagline}{" "}
              </motion.p>
            )}
            <motion.div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base text-gray-300 mb-4 sm:mb-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.5 },
                },
              }}
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center"
              >
                <MdStar className="mr-1 text-yellow-400" /> {getRating()}
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="hidden sm:inline"
              >
                •
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center"
              >
                <FaTicketAlt className="mr-1.5 text-orange-400" /> {getGenres()}
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="hidden sm:inline"
              >
                •
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center"
              >
                <MdAccessTime className="mr-1 text-blue-400" />{" "}
                {formatRuntime(details?.runtime)}
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="hidden sm:inline"
              >
                •
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center"
              >
                <TbLanguage className="mr-1 text-green-400" /> {getYear()}
              </motion.span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-4"
            >
              {" "}
              {getOverview()}{" "}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              {isYTS === true &&
              details?.torrents &&
              details.torrents.length > 0 ? (
                (() => {
                  const firstNon3DTorrent = getFirstNon3DTorrent(
                    details.torrents
                  );
                  return firstNon3DTorrent ? (
                    <Link
                      onClick={() => {
                        markAsWatched(movieId as string);
                      }}
                      href={`/watch/${
                        firstNon3DTorrent.hash
                      }?movieName=${encodeURIComponent(getTitle())}`}
                      passHref
                    >
                      <motion.button
                        className="px-5 sm:px-7 py-2.5 sm:py-3 bg-orange-500 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-orange-600 transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdMovie /> {t("watch")}
                      </motion.button>
                    </Link>
                  ) : (
                    <button
                      className="px-5 sm:px-7 py-2.5 sm:py-3 bg-gray-600 text-white rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 cursor-not-allowed"
                      disabled
                      title={t("no2DTorrentFound")}
                    >
                      <MdMovie /> {t("only3DAvailable")}
                    </button>
                  );
                })()
              ) : !isYTS && details?.id ? (
                torrentHash ? (
                  <Link
                    href={`/watch/${torrentHash}?movieName=${encodeURIComponent(
                      getTitle()
                    )}`}
                    passHref
                  >
                    <motion.button
                      className="px-5 sm:px-7 py-2.5 sm:py-3 bg-orange-500 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-orange-600 transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdMovie /> {t("watch")}
                    </motion.button>
                  </Link>
                ) : isLoadingTorrent ? (
                  <button
                    className="px-5 sm:px-7 py-2.5 sm:py-3 bg-orange-400 text-white rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 cursor-wait"
                    disabled
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    {t("findingTorrent")}
                  </button>
                ) : (
                  <button
                    className="px-5 sm:px-7 py-2.5 sm:py-3 bg-gray-600 text-white rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 cursor-not-allowed"
                    disabled
                    title={t("noTorrentFound")}
                  >
                    <MdMovie /> {t("noTorrentAvailable")}
                  </button>
                )
              ) : (
                <button
                  className="px-5 sm:px-7 py-2.5 sm:py-3 bg-gray-600 text-white rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 cursor-not-allowed"
                  disabled
                >
                  <MdMovie /> {t("watch")}
                </button>
              )}
              <button className="px-5 sm:px-7 py-2.5 sm:py-3 border-2 border-white/80 text-white/90 rounded-full flex items-center justify-center space-x-1.5 font-semibold text-sm sm:text-base hover:bg-white/20 hover:text-white transition transform hover:scale-105 active:scale-95">
                <span>{isWatched ? t("watched") : t("unwatched")}</span>
                {isWatched ? (
                  <MdOutlineFavorite className="text-red-500 text-lg" />
                ) : (
                  <MdOutlineFavoriteBorder className="text-red-500 text-lg" />
                )}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-8 space-y-10">
            {bestTrailerUrl && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                  <FaYoutube /> {t("officialTrailer")}
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
                  <YouTubeEmbed
                    videoid={bestTrailerUrl.split("/").pop() as string}
                  />
                </div>
              </motion.section>
            )}
            {details?.cast && details.cast.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {" "}
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                  <FaUsers /> {t("cast")}
                </h2>{" "}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {" "}
                  {details.cast.slice(0, 10).map((actor, index: number) => (
                    <motion.div
                      key={actor.imdb_code || actor.id || index}
                      className="flex flex-col items-center text-center bg-gray-800/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.9 + index * 0.05,
                      }}
                    >
                      {" "}
                      <Image
                        src={
                          actor.url_small_image ||
                          (actor.profile_path
                            ? `${TMDB_IMAGE_BASE_URL}w185${actor.profile_path}`
                            : `https://placehold.co/600x400.png`)
                        }
                        alt={actor.name}
                        width={112}
                        height={160}
                        className="rounded-md object-cover mb-2 shadow-lg border-2 border-gray-700 h-auto w-auto"
                      />{" "}
                      <p className="font-semibold text-sm sm:text-base text-gray-200 line-clamp-1">
                        {actor.name}
                      </p>{" "}
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
                        {actor.character_name || actor.character}
                      </p>{" "}
                    </motion.div>
                  ))}{" "}
                </div>{" "}
              </motion.section>
            )}

            {APIProvider === "YTS" &&
              details?.torrents &&
              details.torrents.length > 0 &&
              filterOut3DTorrents(details.torrents).length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  {" "}
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                    <MdCloudDownload /> {t("availableTorrents")}
                  </h2>{" "}
                  <div className="space-y-4">
                    {" "}
                    {filterOut3DTorrents(details.torrents).map(
                      (torrentData, index: number) => {
                        const torrent = torrentData as {
                          hash: string;
                          quality: string;
                          type?: string;
                          size?: string;
                          seeds?: number;
                          peers?: number;
                        };
                        return (
                          <motion.div
                            key={torrent.hash || index}
                            className="p-4 bg-gray-800/50 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 1.0 + index * 0.1,
                            }}
                          >
                            {" "}
                            <div className="flex-grow">
                              {" "}
                              <span className="text-lg font-semibold text-orange-300">
                                {torrent.quality}
                              </span>{" "}
                              <span className="text-gray-400 mx-2">|</span>{" "}
                              <span className="text-gray-300">
                                {torrent.type?.toUpperCase() || "N/A"}
                              </span>{" "}
                              <span className="text-gray-400 mx-2">|</span>{" "}
                              <span className="text-gray-300">
                                {t("size")}: {torrent.size || "N/A"}
                              </span>{" "}
                            </div>{" "}
                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-2 sm:mt-0">
                              {" "}
                              <span className="flex items-center gap-1">
                                <BsLightningChargeFill className="text-green-500" />{" "}
                                {torrent.seeds || 0} {t("seeds")}
                              </span>{" "}
                              <span className="flex items-center gap-1">
                                <BsSpeedometer2 className="text-red-500" />{" "}
                                {torrent.peers || 0} {t("peers")}
                              </span>{" "}
                            </div>{" "}
                            <a
                              href={`magnet:?xt=urn:btih:${
                                torrent.hash
                              }&dn=${encodeURIComponent(
                                title
                              )}&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 sm:mt-0 ml-auto sm:ml-4 px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-xs hover:bg-green-700 transition flex items-center gap-1.5"
                            >
                              {" "}
                              <TbMagnet size={16} /> Magnet{" "}
                            </a>{" "}
                          </motion.div>
                        );
                      }
                    )}{" "}
                  </div>{" "}
                </motion.section>
              )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: APIProvider === "YTS" ? 1.0 : 1.1,
              }}
            >
              {" "}
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                {" "}
                <MdPhotoLibrary /> {t("mediaGallery")}{" "}
              </h2>{" "}
              {APIProvider === "YTS" &&
                (details?.medium_screenshot_image1 ||
                  details?.large_screenshot_image1) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {" "}
                    {[
                      details.large_screenshot_image1 ||
                        details.medium_screenshot_image1,
                      details.large_screenshot_image2 ||
                        details.medium_screenshot_image2,
                      details.large_screenshot_image3 ||
                        details.medium_screenshot_image3,
                    ]
                      .filter(Boolean)
                      .map((imgUrl, index) => (
                        <motion.div
                          key={`yts-ss-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.1 + index * 0.1,
                          }}
                        >
                          {" "}
                          <Image
                            src={imgUrl!}
                            alt={`Screenshot ${index + 1}`}
                            width={780}
                            height={439}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="rounded-lg shadow-xl object-cover w-full h-auto aspect-video"
                          />{" "}
                        </motion.div>
                      ))}{" "}
                  </div>
                )}{" "}
              {APIProvider !== "YTS" &&
                details?.images?.backdrops &&
                details.images.backdrops.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {" "}
                    {details.images.backdrops
                      .slice(0, 6)
                      .map((backdrop, index: number) => (
                        <motion.div
                          key={backdrop.file_path || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.2 + index * 0.1,
                          }}
                        >
                          {" "}
                          <Image
                            src={`${TMDB_IMAGE_BASE_URL}w780${backdrop.file_path}`}
                            alt={`Backdrop ${index + 1}`}
                            width={780}
                            height={439}
                            className="rounded-lg shadow-xl object-cover w-full h-auto aspect-video"
                          />{" "}
                        </motion.div>
                      ))}{" "}
                  </div>
                )}{" "}
              {!(
                APIProvider === "YTS" &&
                (details?.medium_screenshot_image1 ||
                  details?.large_screenshot_image1)
              ) &&
                !(
                  APIProvider !== "YTS" &&
                  details?.images?.backdrops &&
                  details.images.backdrops.length > 0
                ) && (
                  <p className="text-gray-400">
                    {t("noGalleryImagesAvailable")}
                  </p>
                )}{" "}
            </motion.section>

            {APIProvider !== "YTS" &&
              details?.images?.logos &&
              details.images.logos.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.15 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                    <MdVideocam /> {t("titleLogos")}
                  </h2>
                  <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
                    {details.images.logos.slice(0, 10).map(
                      (
                        logo // Show up to 10 logos
                      ) =>
                        logo.file_path && (
                          <div
                            key={logo.file_path}
                            className="flex-shrink-0 p-3 bg-gray-800/30 rounded-lg h-28 flex items-center justify-center"
                          >
                            <Image
                              src={`${TMDB_IMAGE_BASE_URL}w300${logo.file_path}`}
                              alt={`${title} Logo ${logo.iso_639_1 || ""}`}
                              width={300}
                              height={112}
                              className={`max-h-24 max-w-[250px] object-contain filter ${
                                logo.iso_639_1 === "en"
                                  ? ""
                                  : "brightness-0 invert"
                              }`}
                            />
                          </div>
                        )
                    )}
                  </div>
                </motion.section>
              )}

            {APIProvider === "TMDB" &&
              details?.production_companies &&
              details.production_companies.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {" "}
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                    <BiCameraMovie /> {t("productionCompanies")}
                  </h2>{" "}
                  <div className="flex flex-wrap gap-4 items-center">
                    {" "}
                    {details.production_companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg min-w-[100px] text-center"
                      >
                        {" "}
                        {company.logo_path ? (
                          <Image
                            src={`${TMDB_IMAGE_BASE_URL}w200${company.logo_path}`}
                            alt={company.name}
                            width={200}
                            height={48}
                            className="h-auto w-auto max-w-[150px] object-contain mb-2 filter brightness-0 invert"
                          />
                        ) : (
                          <div className="h-12 flex items-center justify-center mb-2 text-gray-500">
                            {" "}
                            <BiCameraMovie size={24} />{" "}
                          </div>
                        )}{" "}
                        <p className="text-xs text-gray-300">{company.name}</p>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </motion.section>
              )}

            {APIProvider === "TMDB" && details?.belongs_to_collection && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.25 }}
              >
                {" "}
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-orange-400 flex items-center gap-2">
                  <HiOutlineCollection /> {t("partOfACollection")}
                </h2>{" "}
                <div className="bg-gray-800/30 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700/50 transition-colors">
                  {" "}
                  {details.belongs_to_collection.poster_path && (
                    <Image
                      src={`${TMDB_IMAGE_BASE_URL}w154${details.belongs_to_collection.poster_path}`}
                      alt={details.belongs_to_collection.name}
                      width={154}
                      height={231}
                      className="w-20 h-auto rounded-md shadow-md"
                    />
                  )}{" "}
                  <div>
                    {" "}
                    <h3 className="text-xl font-medium text-gray-100">
                      {details.belongs_to_collection.name}
                    </h3>{" "}
                    <p className="text-sm text-gray-400">
                      {t("viewCollection")}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </motion.section>
            )}
          </div>

          <motion.aside
            className="md:col-span-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {" "}
            <Image
              src={getPosterUrl("w342")}
              alt={`${title} Poster`}
              width={342}
              height={513}
              className="rounded-xl shadow-2xl shadow-black/50 w-full max-w-xs mx-auto md:mx-0 md:w-auto hover:scale-105 transition-transform duration-300"
            />{" "}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              {" "}
              <h3 className="text-xl font-semibold mb-3 text-orange-300">
                {t("moreInformation")}
              </h3>{" "}
              <ul className="space-y-2.5 text-sm text-gray-300">
                {" "}
                {details?.original_title &&
                  details.original_title !== title && (
                    <li>
                      <strong>{t("originalTitle")}:</strong>{" "}
                      {details.original_title}
                    </li>
                  )}{" "}
                <li>
                  <strong>{t("status")}:</strong>{" "}
                  {details?.status ||
                    (APIProvider === "YTS" ? "Available" : "N/A")}
                </li>{" "}
                <li>
                  <strong>{t("languages")}:</strong> {getSpokenLanguages()}
                </li>{" "}
                {APIProvider === "YTS" &&
                  details?.mpa_rating &&
                  details.mpa_rating.trim() !== "" && (
                    <li>
                      <strong>{t("mpaRating")}:</strong> {details.mpa_rating}
                    </li>
                  )}{" "}
                {APIProvider !== "YTS" &&
                  details?.budget &&
                  details.budget > 0 && (
                    <li>
                      <strong>{t("budget")}:</strong> $
                      {details.budget.toLocaleString()}
                    </li>
                  )}{" "}
                {APIProvider !== "YTS" &&
                  details?.revenue &&
                  details.revenue > 0 && (
                    <li>
                      <strong>{t("revenue")}:</strong> $
                      {details.revenue.toLocaleString()}
                    </li>
                  )}{" "}
                {APIProvider !== "YTS" &&
                  details?.production_countries &&
                  details.production_countries.length > 0 && (
                    <li>
                      <strong>{t("production")}:</strong>{" "}
                      {details.production_countries
                        .map((pc) => pc.name)
                        .join(", ")}
                    </li>
                  )}{" "}
                {(details?.imdb_id || details?.imdb_code) && (
                  <li>
                    {" "}
                    <strong>IMDb:</strong>{" "}
                    <a
                      href={`https://www.imdb.com/title/${
                        details.imdb_id || details.imdb_code
                      }/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline flex items-center gap-1"
                    >
                      <MdLink /> {details.imdb_id || details.imdb_code}
                    </a>{" "}
                  </li>
                )}{" "}
                {details?.homepage && APIProvider !== "YTS" && (
                  <li>
                    {" "}
                    <strong>{t("homepage")}:</strong>{" "}
                    <a
                      href={details.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <MdLink /> {t("visitSite")}
                    </a>{" "}
                  </li>
                )}{" "}
                {APIProvider === "YTS" && details?.url && (
                  <li>
                    {" "}
                    <strong>{t("ytsPage")}:</strong>{" "}
                    <a
                      href={details.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <MdLink /> {t("viewOnYTS")}
                    </a>{" "}
                  </li>
                )}{" "}
                {APIProvider === "YTS" &&
                  details?.like_count &&
                  details.like_count > 0 && (
                    <li>
                      <strong>{t("likes")}:</strong>{" "}
                      {details.like_count.toLocaleString()}
                    </li>
                  )}{" "}
              </ul>{" "}
            </div>{" "}
          </motion.aside>
        </div>

        {hasSimilarMovies() && (
          <motion.section
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-orange-400 flex items-center gap-2">
              {" "}
              <BiSolidMoviePlay /> {t("youMightAlsoLike")}{" "}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {getSimilarMoviesArray()
                .slice(0, 6)
                .map((movie, index: number) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.4 + index * 0.05 }}
                    className="bg-gray-800/30 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-500/30 transition-shadow duration-300 group"
                  >
                    <Link href={`${movie.id}`} className="block">
                      <Image
                        src={getSmallCoverImage(movie)}
                        alt={movie.title_english || movie.title || "Movie"}
                        width={200}
                        height={300}
                        className="w-full h-auto aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-3">
                        {" "}
                        <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-orange-400 transition-colors">
                          {" "}
                          {movie.title_english || movie.title}{" "}
                        </h3>{" "}
                        <p className="text-xs text-gray-400">
                          {movie.year || movie.release_date?.split("-")[0]}
                        </p>{" "}
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.section>
        )}
        <CommentsSection
          movieId={movieId as string}
          user={
            user.user
              ? {
                  token: null,
                  id: user.user.id,
                  username: user.user.username,
                  profile_picture: user.user.profile_picture,
                }
              : { token: null }
          }
        />
      </div>
    </div>
  );
}
