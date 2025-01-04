"use client";

import { useParams } from 'next/navigation'
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdOutlineFavorite } from "react-icons/md";
import Comments from "@/app/components/Comments/Comments";
import { useEffect, useState } from "react";
import { movieService } from "@/lib/movie";
import { Movie as MovieType } from '@/lib/interface';
import { Alert, AlertTitle } from '@mui/material';

interface MovieState {
    movie: MovieType | null;
    isLoading: boolean;
    error: string | null;
  }
  

export default function Movie() {
    const APIProvider = useSelector(
        (state: any) => state.APIProviderSlice.APIProvider);
    const { movieId } = useParams();
    const [state, setState] = useState<MovieState>({
        movie: null,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const getMovieDetails = async () => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            try {
                const response = await movieService.getMovieDetails(
                    movieId,
                    APIProvider === 'YTS' ? 'yts' : 'tmdb'
                );
                setState({
                    movie: response.data,
                    isLoading: false,
                    error: response.error
                });
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: "An unexpected error occurred"
                }));
            }
        }
        getMovieDetails();
        return () => {
            setState({
                movie: null,
                isLoading: true,
                error: null
            });
        };
    }, [movieId, APIProvider]);

    if (state.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Alert className="max-w-lg">
                    <AlertTitle>Error Loading Movie</AlertTitle>
                </Alert>
            </div>
        );
    }

    if (!state.movie) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Alert className="max-w-lg">
                    <AlertTitle>Movie Not Found</AlertTitle>
                </Alert>
            </div>
        );
    }
    console.log("state ==",state);
    return (
        <div className="min-h-screen max-w-[1500px] mx-auto text-white w-full flex flex-col overflow-auto">
            <div className=" h-[60vh] sm:h-[70vh] md:h-[75vh] w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative h-full flex items-center bg-cover bg-center text-white"
                    style={{
                        backgroundImage: `url(${(state?.movie?.movie?.backdrop_path &&
                            `https://image.tmdb.org/t/p/original${state?.movie.backdrop_path}`) ||
                            (state?.movie?.movie?.medium_cover_image && state?.movie?.movie?.medium_cover_image) ||
                            `https://via.placeholder.com/1920x1080?text=${state?.movie?.movie?.title}`
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
                                {state?.movie?.movie?.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="text-base sm:text-lg w-96 md:w-full text-gray-300 mb-6 animate-fade-in-up"
                            >
                                {(state?.movie?.movie?.summary && state?.movie?.movie?.summary) ||
                                    (state?.movie?.movie?.overview && state?.movie?.movie?.overview)}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="text-base sm:text-lg w-96 md:w-full text-gray-300 mb-6 animate-fade-in-up"
                            >
                                {state?.movie?.movie?.release_date?.split("-")[0] || state?.movie?.movie?.year} |{" "}
                                {/* {state?.movie.genres?.map((genre: string) => genre).join(", ") ||
                                state?.movie.genre_ids
                                    .map((id: number) => {
                                        const genre = genres.find(
                                            (genre: any) => genre.id === id
                                        );
                                        return genre?.name;
                                    })
                                    .join(", ")}{" "}
                            |{" "} */}
                                {state?.movie?.movie?.rating
                                    ? state?.movie?.movie?.rating
                                    : Number(state?.movie?.movie?.vote_average).toFixed(1)}
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
                                <button className="px-5 sm:px-6 py-2 sm:py-3 border-2 border-white text-white rounded-full flex items-center justify-center space-x-1 font-semibold hover:bg-gray-200 hover:text-black transition transform hover:scale-105 active:scale-95">
                                    <span>add watchlist</span> <MdOutlineFavorite className="text-red-500" />
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
                            <img
                                src={
                                    (state?.movie?.movie?.large_cover_image && state?.movie?.movie?.large_cover_image) ||
                                    (state?.movie?.movie?.poster_path &&
                                        `https://image.tmdb.org/t/p/original${state?.movie?.movie?.poster_path}`) ||
                                    `https://via.placeholder.com/300x450?text=${state?.movie?.movie?.title}`
                                }
                                alt={`${state?.movie?.movie?.title} Poster`}
                                width={300}
                                height={450}
                                className="rounded-xl shadow-2xl shadow-black hover:scale-105 transition-transform duration-300"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            <Comments />
        </div>
    );
}