"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
}

function PopularMoviesSection() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(true);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("PopularMoviesSection");

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies`
        );
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data: any = await res.json();
        setPopularMovies(data.movies.results);
      } catch (err: any) {
        setMoviesError(err.message);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchPopularMovies();
  }, []);
  return (
    <section className="py-20 px-6 bg-slate-900/80">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-10">
          {t("title")}
        </h2>

        {loadingMovies ? (
          <div className="text-center text-gray-300">Loading movies...</div>
        ) : moviesError ? (
          <div className="text-center text-red-500">{moviesError}</div>
        ) : popularMovies.length === 0 ? (
          <div className="text-center text-gray-300">
            {t("nomovie")}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popularMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {movie.title}
                  </h3>
                  <button
                    onClick={() => router.push(`/browse/movie/${movie.id}`)}
                    className="mt-2 inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-medium"
                  >
                    {t("viewDetails")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularMoviesSection;
