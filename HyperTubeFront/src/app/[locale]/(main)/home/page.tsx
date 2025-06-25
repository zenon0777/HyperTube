"use client";
import { Info } from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MovieSection } from "@/app/components/MovieSection/MovieSection";
import { useAPIProvider } from "@/app/hooks/useAPIProvider";
import { getGenres } from "@/app/data/NavBarElements";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

interface MovieData {
  id: number;
  title: string;
  backdrop_path?: string;
  medium_cover_image?: string;
  large_cover_image?: string;
  poster_path?: string;
  summary?: string;
  overview?: string;
  release_date?: string;
  year?: number;
  genres?: string[];
  genre_ids?: number[];
  rating?: number;
  vote_average?: number;
  is_watched?: boolean;
}

interface TMDBMovieListResponse {
  movies?: {
    results: MovieData[];
  };
}

interface YTSMovieListResponse {
  data?: {
    movies: MovieData[];
  };
}

interface Genre {
  id: number;
  name: string;
}

export default function Home() {
  const { isTMDB } = useAPIProvider();
  const router = useRouter();
  const [popularMovies, setPopularMovies] = useState<MovieData[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieData[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MovieData[]>([]);
  const t = useTranslations();

  useEffect(() => {
    const getTMDBFiltredMovies = async () => {
      try {
        const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/tmdb_movie_list`;
        let popularMoviesUrl = baseUrl + "?popular";
        popularMoviesUrl += "?language=en-US&page=1&include_adult=false";
        const topRatedMoviesUrl =
          baseUrl +
          "?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200";
        const nowPlayingMoviesUrl =
          baseUrl +
          "?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte={min_date}&release_date.lte={max_date}";
        const response = await fetch(popularMoviesUrl, {
          credentials: "include",
        });
        const data: TMDBMovieListResponse = await response.json();
        setPopularMovies(data.movies?.results || []);
        const response2 = await fetch(topRatedMoviesUrl, {
          credentials: "include",
        });
        const data2: TMDBMovieListResponse = await response2.json();
        setTopRatedMovies(data2.movies?.results || []);
        const response3 = await fetch(nowPlayingMoviesUrl, {
          credentials: "include",
        });
        const data3: TMDBMovieListResponse = await response3.json();
        setNowPlayingMovies(data3.movies?.results || []);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    };
    const getYTSFiltredMovies = async () => {
      try {
        const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/yts_movie_list?page=1&limit=15`;
        let popularMoviesUrl = baseUrl;
        let topRatedMoviesUrl = baseUrl;
        topRatedMoviesUrl += "&sort_by=rating&order_by=desc";
        popularMoviesUrl += "&sort_by=download_count&order_by=desc";
        let nowPlayingMoviesUrl = baseUrl;
        nowPlayingMoviesUrl += "&sort_by=date_added&order_by=desc";
        const response = await fetch(popularMoviesUrl, {
          credentials: "include",
        });
        const data: YTSMovieListResponse = await response.json();
        setPopularMovies(data.data?.movies || []);
        const response2 = await fetch(topRatedMoviesUrl, {
          credentials: "include",
        });
        const data2: YTSMovieListResponse = await response2.json();
        setTopRatedMovies(data2.data?.movies || []);
        const response3 = await fetch(nowPlayingMoviesUrl, {
          credentials: "include",
        });
        const data3: YTSMovieListResponse = await response3.json();
        setNowPlayingMovies(data3.data?.movies || []);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    };
    if (isTMDB === true) {
      getTMDBFiltredMovies();
    } else {
      getYTSFiltredMovies();
    }
  }, [isTMDB]);

  useEffect(() => {
    const get_is_watched = async () => {
      try {
        popularMovies.forEach((movie: MovieData) => {
          try {
            var res = fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/is_watched/${movie.id}`,
              {
                credentials: "include",
              }
            );
            res
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                // else {
                //   throw new Error("Failed to fetch watched status");
                // }
              })
              .then((data) => {
                console.log("first :: ", data);
                if (data.is_watched) {
                  movie.is_watched = true;
                }
              })
              .catch((error) => {
                const message =
                  error instanceof Error ? error.message : "An error occurred";
                toast.error(message);
              });
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast.error(message);
          }
        });
        topRatedMovies.forEach((movie: MovieData) => {
          try {
            var res = fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/is_watched/${movie.id}`,
              {
                credentials: "include",
              }
            );
            res
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                //  else {
                //   throw new Error("Failed to fetch watched status");
                // }
              })
              .then((data) => {
                console.log("second :: ", data);
                if (data.is_watched) {
                  movie.is_watched = true;
                }
              })
              .catch((error) => {
                const message =
                  error instanceof Error ? error.message : "An error occurred";
                toast.error(message);
              });
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast.error(message);
          }
        });
        nowPlayingMovies.forEach((movie: MovieData) => {
          try {
            var res = fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/is_watched/${movie.id}`,
              {
                credentials: "include",
              }
            );
            res
              .then((response) => {
                if (response.ok) {
                  return response.json();
                  // } else {
                  //   throw new Error("Failed to fetch watched status");
                }
              })
              .then((data) => {
                console.log("third :: ", data);
                if (data.is_watched) {
                  movie.is_watched = true;
                }
              })
              .catch((error) => {
                const message =
                  error instanceof Error ? error.message : "An error occurred";
                toast.error(message);
              });
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "An error occurred";
            toast.error(message);
          }
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    };
    get_is_watched();
  }, [popularMovies, topRatedMovies, nowPlayingMovies]);

  return (
    <div className="min-h-screen max-w-[1500px] mx-auto bg-gray-900 text-white w-full flex flex-col">
      <div className=" h-[60vh] sm:h-[70vh] md:h-[75vh] w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={false}
          pagination={{ clickable: true }}
          style={
            { "--swiper-pagination-color": "#FB9722" } as React.CSSProperties
          }
          slidesPerView={1}
          spaceBetween={20}
          className="h-full swiper-container"
        >
          {nowPlayingMovies?.map((movie: MovieData, index: number) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative h-full flex items-center bg-cover bg-center text-white"
                style={{
                  backgroundImage: `url(${(movie.backdrop_path &&
                      `https://image.tmdb.org/t/p/original${movie.backdrop_path}`) ||
                    (movie.medium_cover_image && movie.medium_cover_image) ||
                    `https://via.placeholder.com/1920x1080?text=${movie.title}`
                    })`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-black to-transparent opacity-70"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-black to-transparent opacity-70"></div>

                <div className="relative z-10 container justify-center px-4 sm:px-8 flex flex-col md:flex-row items-center gap-6 md:gap-11 w-5/6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3,
                      ease: "easeOut",
                    }}
                    className="w-full md:w-1/2"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-Lemonada font-bold mb-4 animate-pulse-slow"
                    >
                      {movie.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-base sm:text-lg w-96 md:w-full text-gray-300 mb-6 animate-fade-in-up"
                    >
                      {(movie.summary && movie.summary) ||
                        (movie.overview && movie.overview)}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-base sm:text-lg w-96 md:w-full text-gray-300 mb-6 animate-fade-in-up"
                    >
                      {movie.release_date?.split("-")[0] || movie.year} |{" "}
                      {movie.genres?.map((genre: string) => genre).join(", ") ||
                        movie.genre_ids
                          ?.map((id: number) => {
                            const genre = getGenres(t).find(
                              (genreItem: Genre) => genreItem.id === id
                            );
                            return genre?.name;
                          })
                          .join(", ")}{" "}
                      |{" "}
                      {movie.rating
                        ? movie.rating
                        : Number(movie.vote_average).toFixed(1)}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex gap-4"
                    >
                      <button
                        onClick={() => router.push(`browse/movie/${movie.id}`)}
                        className="px-5 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition transform hover:scale-105 active:scale-95"
                      >
                        {t("watchNow")}
                      </button>
                      <button
                        onClick={() => router.push(`browse/movie/${movie.id}`)}
                        className="px-5 sm:px-6 py-2 sm:py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-gray-200 hover:text-black transition transform hover:scale-105 active:scale-95"
                      >
                        {t("details")} <Info />
                      </button>

                    </motion.div>
                    <button className="px-5 sm:px-7 py-2.5 mt-8 sm:py-3 border-2 border-white/80 text-white/90 rounded-full flex items-center justify-center space-x-1.5 font-semibold text-sm sm:text-base hover:bg-white/20 hover:text-white transition transform hover:scale-105 active:scale-95">
                      <span>{movie.is_watched ? t("watched") : t("unwatched")}</span>
                      {movie.is_watched ? (
                        <MdOutlineFavorite className="text-red-500 text-lg" />
                      ) : (
                        <MdOutlineFavoriteBorder className="text-red-500 text-lg" />
                      )}
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5,
                      ease: "easeOut",
                    }}
                    className="hidden md:flex"
                  >
                    <Image
                      src={
                        (movie.large_cover_image && movie.large_cover_image) ||
                        (movie.poster_path &&
                          `https://image.tmdb.org/t/p/original${movie.poster_path}`) ||
                        `https://via.placeholder.com/300x450?text=${movie.title}`
                      }
                      alt={`${movie.title} Poster`}
                      width={300}
                      height={450}
                      priority={true}
                      className="rounded-xl shadow-2xl shadow-black hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <MovieSection title={t("popularMovies")} movies={popularMovies} />
      <MovieSection title={t("topRatedMovies")} movies={topRatedMovies} />
      {/* <MovieSection title={t("watchedMovies")} movies={WatchedMovies} /> */}
    </div>
  );
}
