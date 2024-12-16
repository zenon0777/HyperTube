"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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

export default function Home() {
  return (
    <div className="min-h-screen max-w-[1500px] mx-auto bg-gray-900 text-white w-full flex flex-col">
      <div className=" h-[60vh] sm:h-[70vh] md:h-[75vh]">
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
          {movies.map((movie, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative h-full flex items-center bg-cover bg-center text-white"
                style={{
                  backgroundImage: `url(${movie.background})`,
                }}
              >
                {/* Existing Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-black to-transparent opacity-70"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-black to-transparent opacity-70"></div>

                {/* Movie Details with Staggered Animations */}
                <div className="relative z-10 container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3,
                      ease: "easeOut",
                    }}
                    className="w-2xl"
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
                      className="text-base sm:text-lg text-gray-300 mb-6 animate-fade-in-up"
                    >
                      {movie.description}
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
                        Watch trailer
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
                    className="hidden lg:flex"
                  >
                    <Image
                      src={movie.poster}
                      alt={`${movie.title} Poster`}
                      width={300}
                      height={450}
                      className="rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Sections with Animated Headings */}
      {["Popular Movies", "Watched Movies", "Top Rated Movies"].map(
        (sectionTitle, idx) => (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            key={idx}
            className="bg-black py-8 sm:py-12"
          >
            <div className="container mx-auto px-4 sm:px-8">
              <div className="flex justify-between items-start mb-6">
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl text-[#A7B5BE] font-Lemonada font-semibold"
                >
                  {sectionTitle}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center px-4 py-1 border-2 border-white rounded-full"
                >
                  <a
                    href="#"
                    className="text-white text-sm sm:text-md relative group hover:text-[#FB9722] transition"
                  >
                    View all
                  </a>
                </motion.div>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  400: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 25 },
                  1280: { slidesPerView: 5, spaceBetween: 30 },
                }}
                className="swiper-container"
              >
                {movies.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                      className="relative group"
                    >
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={300}
                        height={400}
                        className="xs:w-[180px] sm:w-[200px] md:[w-300px] lg:w-[300px] h-auto rounded-xl shadow-lg"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      {/* Text Content */}
                      <motion.div
                        initial={{ opacity: 1, y: 10 }}
                        whileHover={{ opacity: 1, y: 10 }}
                        className="absolute inset-x-0 bottom-4 text-center px-2"
                      >
                        <h3 className="text-white text-sm sm:text-base font-semibold">
                          {movie.title}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm">
                          {movie.genre}
                        </p>
                        <span className="text-orange-500 text-sm sm:text-base font-medium">
                          ★ 8.9
                        </span>
                      </motion.div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.section>
        )
      )}
    </div>
  );
}
