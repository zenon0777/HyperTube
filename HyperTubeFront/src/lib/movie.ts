import api from "./axios";
import { Movie } from "./interface";
interface MovieResponse {
    data: Movie | null;
    isLoading: boolean;
    error: string | null;
}

export const movieService = {
    async getMovieDetails(
        movieId: string | string[] | undefined,
        provider: string
    ): Promise<MovieResponse> {
        if (!movieId || (Array.isArray(movieId) && movieId.length === 0)) {
            return {
                data: null,
                isLoading: false,
                error: "Invalid movie ID provided"
            };
        }

        try {
            const response = await api.get<Movie>(
                `movies/movies/${Array.isArray(movieId) ? movieId[0] : movieId}?provider=${provider}`
            );
            return {
                data: response.data,
                isLoading: false,
                error: null
            };
        } catch (error) {
            console.log("Failed to fetch movie details:", error);
            return {
                data: null,
                isLoading: false,
                error: "Failed to fetch movie details. Please try again later."
            };
        }
    },
};