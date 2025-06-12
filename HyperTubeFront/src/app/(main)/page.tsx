"use client";
import { Info } from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MovieSection } from "../components/MovieSection/MovieSection";
import { genres } from "../data/NavBarElements";
import { RootState, useAppSelector } from "../store";
import { useAPIProvider } from "../hooks/useAPIProvider";
import { useRouter } from "next/navigation";
import { getUserProfile } from "../store/userSlice";

export default function Rootpage() {
  const [movies, setMovies] = useState([]);
  const { APIProvider } = useAPIProvider();
  const [popularMovies, setPopularMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  useEffect(() => {
    const getTMDBFiltredMovies = async () => {
      try {
        let baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/tmdb_movie_list`;
        let popularMoviesUrl = baseUrl + "?popular";
        popularMoviesUrl += "?language=en-US&page=1&include_adult=false";
        let topRatedMoviesUrl = baseUrl + "?top_rated";
        topRatedMoviesUrl += "?language=en-US&page=1&include_adult=false";
        let NowPlayingMoviesUrl =
          baseUrl +
          "?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte={min_date}&release_date.lte={max_date}";
        const response = await fetch(popularMoviesUrl, {
          credentials: "include",
        });
        const data = await response.json();
        console.log("Popular movies : --------> ", data.movies?.results);
        setPopularMovies(data.movies?.results);
        const response2 = await fetch(topRatedMoviesUrl, {
          credentials: "include",
        });
        const data2 = await response2.json();
        console.log("Top Rated movies : --------> ", data2.movies?.results);
        setTopRatedMovies(data2.movies?.results);
        const response3 = await fetch(NowPlayingMoviesUrl, {
          credentials: "include",
        });
        const data3 = await response3.json();
        console.log("Now Playing movies : --------> ", data3.movies?.results);
        setNowPlayingMovies(data3.movies?.results);
        setMovies(data.movies?.results);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const getYTSFiltredMovies = async () => {
      try {
        let baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/yts_movie_list?page=1&limit=15`;
        let PopularMoviesUrl = baseUrl;
        let topRatedMoviesUrl = baseUrl;
        topRatedMoviesUrl += "&sort_by=rating&order_by=desc";
        PopularMoviesUrl += "&sort_by=download_count&order_by=desc";
        let nowPlayingMoviesUrl = baseUrl;
        nowPlayingMoviesUrl += "&sort_by=date_added&order_by=desc";
        const response = await fetch(PopularMoviesUrl, {
          credentials: "include",
        });
        const data = await response.json();
        console.log("Popular : --------> ", data);
        setPopularMovies(data.data?.movies);
        const response2 = await fetch(topRatedMoviesUrl, {
          credentials: "include",
        });
        const data2 = await response2.json();
        console.log("Top Rated : --------> ", data2);
        setTopRatedMovies(data2.data?.movies);
        const response3 = await fetch(nowPlayingMoviesUrl, {
          credentials: "include",
        });
        const data3 = await response3.json();
        console.log("Now Playing : --------> ", data3);
        setNowPlayingMovies(data3.data?.movies);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    APIProvider === "TMDB" ? getTMDBFiltredMovies() : getYTSFiltredMovies();
    console.log("APIProvider : --------> :: ", APIProvider);
  }, [APIProvider]);

  return (
    <div className="min-h-screen max-w-[1500px] mx-auto bg-gray-900 text-white w-full flex flex-col">
      <div className=" h-[60vh] sm:h-[70vh] md:h-[75vh] w-full">
        {/* latest movies */}
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
          {nowPlayingMovies?.map((movie: any, index: number) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative h-full flex items-center bg-cover bg-center text-white"
                style={{
                  backgroundImage: `url(${
                    (movie.backdrop_path &&
                      `https://image.tmdb.org/t/p/original${movie.backdrop_path}`) ||
                    (movie.medium_cover_image && movie.medium_cover_image) ||
                    `https://via.placeholder.com/1920x1080?text=${movie.title}`
                  })`,
                }}
              >
                {/* Existing Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-black to-transparent opacity-70"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-black to-transparent opacity-70"></div>

                {/* Movie Details with Staggered Animations */}
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
                          .map((id: number) => {
                            const genre = genres.find(
                              (genre: any) => genre.id === id
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
                      <button className="px-5 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition transform hover:scale-105 active:scale-95">
                        Watch now
                      </button>
                      <button className="px-5 sm:px-6 py-2 sm:py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-gray-200 hover:text-black transition transform hover:scale-105 active:scale-95">
                        Details <Info />
                      </button>
                    </motion.div>
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

      <MovieSection title="Popular Movies" movies={popularMovies} />
      <MovieSection title="Top Rated Movies" movies={topRatedMovies} />
      {/* <MovieSection title="Watched Movies" movies={Watched Movies} /> */}
    </div>
  );
}
