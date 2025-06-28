import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from 'next/navigation';
import { getGenres } from "@/app/data/NavBarElements";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Movie {
  id: string | number;
  title?: string;
  name?: string;
  poster_path?: string;
  large_cover_image?: string;
  release_date?: string;
  first_air_date?: string;
  year?: number;
  vote_average?: number;
  rating?: number;
  genres?: string[];
  genre_ids?: number[];
  is_watched?: boolean;
}

interface Genre {
  id: number;
  name: string;
}

export const MovieSection = ({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) => {
  const router = useRouter();
  const handleMovieClick = (movieId: string | number) => {
    router.push(`/browse/movie/${movieId}`);
  };

  const t = useTranslations();

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-black py-8 sm:py-12 xl:justify-center xl:items-center flex"
    >
      <div className="container justify-center px-4 sm:px-8">
        <div className="flex justify-between items-start mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl text-[#A7B5BE] font-Lemonada font-semibold"
          >
            {title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center px-4 py-1 border-2 border-white rounded-full"
          >
            <Link
              href={`/browse/movie`}
              className="text-white text-sm sm:text-md relative group hover:text-[#FB9722] transition"
            >
              {t("movieSection.viewAll")}
            </Link>
          </motion.div>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          style={
            { "--swiper-navigation-color": "#F97316" } as React.CSSProperties
          }
          breakpoints={{
            400: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 25 },
            1280: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="swiper-container"
        >
          {movies?.map((movie, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative">
                  <Image
                    src={
                      (movie.large_cover_image && movie.large_cover_image) ||
                      (movie.poster_path &&
                        `https://image.tmdb.org/t/p/original${movie.poster_path}`) ||
                      `https://placehold.co/300x450.png`
                    }
                    alt={movie.title || movie.name || "Movie"}
                    width={300}
                    height={400}
                    priority
                    className="xs:w-[180px] sm:w-[200px] md:[w-300px] lg:w-[300px] h-auto rounded-xl shadow-lg"
                  />
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-1 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  onClick={() => handleMovieClick(movie?.id)}
                ></div>

                <motion.div
                  initial={{ opacity: 1, y: 10 }}
                  whileHover={{ opacity: 1, y: 10 }}
                  className="absolute inset-x-0 bottom-4 text-center px-2"
                >
                  <h3 className="text-white text-sm sm:text-base font-semibold">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-gray-100 text-xs sm:text-sm">
                    {movie.genres?.map((genre: string) => genre).join(", ") ||
                      movie.genre_ids
                        ?.map((id: number) => {
                          const genre = getGenres(t).find(
                            (genre: Genre) => genre.id === id
                          );
                          return genre?.name;
                        })
                        .join(", ") || ""}
                  </p>
                  <motion.div className="flex items-center justify-center gap-2">
                    <p className="text-gray-100 text-xs sm:text-sm">
                      {movie.release_date
                        ? movie.release_date?.split("-")[0]
                        : movie.year || movie.first_air_date?.split("-")[0]}
                    </p>
                    <span className="text-orange-500 text-sm sm:text-base font-medium">
                      {movie.vote_average
                        ? Number(movie.vote_average).toFixed(1)
                        : movie.rating}{" "}
                      <span className="text-yellow-400">★</span>
                    </span>
                  </motion.div>


                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-1"
                  >
                    <span className={`text-xs px-2 py-1 rounded-full ${movie.is_watched
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                      }`}>
                      {movie.is_watched ? '✓ Watched' : '○ Not Watched'}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
};