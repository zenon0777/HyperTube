"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
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
    title: "Avengers: Endgame",
    year: 2019,
    duration: "3 hours 2 minutes",
    genre: "Sci-fi, Action",
    description:
      "The Avengers assemble once more to reverse the destruction caused by Thanos and restore balance to the universe.",
    background: "/imk.jpeg",
    poster: "/imk.jpeg",
  },
  {
    id: 3,
    title: "DAIFI: Endgame",
    year: 2019,
    duration: "3 hours 2 minutes",
    genre: "Sci-fi, Action",
    description:
      "The DAIFI assemble once more to reverse the destruction caused by Thanos and restore balance to the universe.",
    background: "/imk.jpeg",
    poster: "/imk.jpeg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black justify-center items-center flex">
      <div className="relative min-h-screen max-w-[1500px] bg-gray-900 text-white w-full justify-center items-center ">
        <header className=" absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center bg-transparent z-50">
          <nav className="w-full px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src="/logo.svg" alt="Z-Tube Logo" width={40} height={40} />
              <span className="text-xl font-semibold font-praiseRegular">
                Z-Tube
              </span>
            </div>
            <div className="flex items-center gap-8">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-800 bg-opacity-50 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <a href="#" className="relative text-white group">
                Home
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-yellow-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </a>
              <a href="#" className="relative text-white group">
                Movies
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-yellow-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </a>
              <a href="#" className="relative text-white group">
                Series
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-yellow-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </a>
              <button className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
                Sign in
              </button>
              <button className="px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition">
                Register
              </button>
            </div>
          </nav>
        </header>

        {/* Swiper for Movies with Full-Page Background */}
        <div className="relative h-[800px]">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={false}
            pagination={{ clickable: true }}
            style={{ "--swiper-pagination-color": "#FB9722" }}
            slidesPerView={1}
            spaceBetween={20}
            className="h-full swiper-container"
          >
            {movies.map((movie, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative h-full flex items-center bg-cover bg-center text-white"
                  style={{
                    backgroundImage: `url(${movie.background})`,
                  }}
                >
                  {/* Enhanced shadow effect on the left and right edges */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent opacity-70"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent opacity-70"></div>

                  <div className="relative z-10 container mx-auto px-8 flex flex-col md:flex-row items-center gap-10">
                    <div className="max-w-lg">
                      <h1 className="text-6xl font-Lemonada font-bold mb-4">
                        {movie.title}
                      </h1>
                      <p className="text-lg text-gray-300 mb-6">
                        {movie.description}
                      </p>
                      <div className="flex gap-4">
                        <button className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition">
                          Watch now
                        </button>
                        <button className="px-6 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-gray-200 hover:text-black transition">
                          Watch trailer
                        </button>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Image
                        src={movie.poster}
                        alt={`${movie.title} Poster`}
                        width={300}
                        height={450}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="justify-center items-center flex-row">
          <section id="Popular movies" className="bg-black py-12">
            <div className="container mx-auto px-8">
              <div className="flex justify-between items-start mb-4 h-20 ">
                <h2 className="text-4xl text-[#A7B5BE] font-Lemonada font-semibold">
                  Popular Movies
                </h2>
                <div className="flex items-center px-4 py-1 border-2 border-white rounded-full">
                  <a
                    href="#"
                    className="text-white relative group text-md hover:text-[#FB9722]"
                  >
                    View all
                  </a>
                </div>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                className="swiper-container"
              >
                {movies.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <div className="relative group">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={300}
                        height={400}
                        className="w-[300px] h-[400px] rounded-3xl shadow-lg transition duration-300 transform group-hover:scale-105"
                      />
                      <div className="inset-0 rounded-lg opacity-1 transition duration-300 flex-col justify-start items-center">
                        <h3 className="text-white text-xl font-semibold">
                          {movie.title}
                        </h3>
                        <h4 className="text-gray-300 text-sm  py-1 rounded-full">
                          {movie.genre}
                        </h4>
                        <h4 className="text-white text-sm font-semibold bg-orange-500 rounded-full text-center w-12">
                          {movie.year}
                        </h4>
                        {/* review */}
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500">★</span>
                          <span className="text-white">8.9</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
          <section id="Watched movies" className="bg-black py-12 ">
            <div className="container mx-auto px-8">
              <div className="flex justify-between items-start mb-4 h-20 ">
                <h2 className="text-4xl text-[#A7B5BE] font-Lemonada font-bold-700">
                  Watched Movies
                </h2>
                <div className="flex items-center px-4 py-1 border-2 border-white rounded-full">
                  <a
                    href="#"
                    className="text-white relative group text-md hover:text-[#FB9722]"
                  >
                    View all
                  </a>
                </div>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                className="swiper-container"
              >
                {movies.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <div className="relative group">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={300}
                        height={400}
                        className="w-[300px] h-[400px] rounded-3xl shadow-lg transition duration-300 transform group-hover:scale-105"
                      />
                      <div className="inset-0 rounded-lg opacity-1 transition duration-300 flex-col justify-start items-center">
                        <h3 className="text-white text-xl font-semibold">
                          {movie.title}
                        </h3>
                        <h4 className="text-gray-300 text-sm  py-1 rounded-full">
                          {movie.genre}
                        </h4>
                        <h4 className="text-white text-sm font-semibold bg-orange-500 rounded-full text-center w-12">
                          {movie.year}
                        </h4>
                        {/* review */}
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500">★</span>
                          <span className="text-white">8.9</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
          <section id="Top rated movies" className="bg-black py-12 ">
            <div className="container mx-auto px-8">
              <div className="flex justify-between items-start mb-4 h-20 ">
                <h2 className="text-4xl text-[#A7B5BE] font-Lemonada font-bold-700">
                  Top Rated Movies
                </h2>
                <div className="flex items-center px-4 py-1 border-2 border-white rounded-full">
                  <a
                    href="#"
                    className="text-white relative group text-md hover:text-[#FB9722]"
                  >
                    View all
                  </a>
                </div>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                className="swiper-container"
              >
                {movies.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <div className="relative group">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={300}
                        height={400}
                        className="w-[300px] h-[400px] rounded-3xl shadow-lg transition duration-300 transform group-hover:scale-105"
                      />
                      <div className="inset-0 rounded-lg opacity-1 transition duration-300 flex-col justify-start items-center">
                        <h3 className="text-white text-xl font-semibold">
                          {movie.title}
                        </h3>
                        <h4 className="text-gray-300 text-sm  py-1 rounded-full">
                          {movie.genre}
                        </h4>
                        <h4 className="text-white text-sm font-semibold bg-orange-500 rounded-full text-center w-12">
                          {movie.year}
                        </h4>
                        {/* review */}
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500">★</span>
                          <span className="text-white">8.9</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
