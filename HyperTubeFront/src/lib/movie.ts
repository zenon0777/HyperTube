import api from "./axios";
import { Movie } from "./interface";

interface MovieResponse {
    data: Movie | null;
    isLoading: boolean;
    error: string | null;
}

export interface Comment {
    id: string;
    comment: string;
    username: string;
    avatar: string;
    date: string;
}

interface CommentResponse {
    data: Comment[] | null;
    isLoading: boolean;
    error: string | null;
}

interface AddCommentResponse {
    data: Comment | null;
    isLoading: boolean;
    error: string | null;
}

interface UpdateCommentResponse {
    data: Comment | null;
    isLoading: boolean;
    error: string | null;
}

interface DeleteCommentResponse {
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

    async getMovieComments(movieId: string | string[] | undefined): Promise<CommentResponse> {
        if (!movieId || (Array.isArray(movieId) && movieId.length === 0)) {
            return {
                data: null,
                isLoading: false,
                error: "Invalid movie ID provided"
            };
        }

        try {
            const response = await api.get<Comment[]>(
                `movies/movies/${Array.isArray(movieId) ? movieId[0] : movieId}/comments`
            );
            return {
                data: response.data,
                isLoading: false,
                error: null
            };
        } catch (error) {
            console.log("Failed to fetch comments:", error);
            return {
                data: null,
                isLoading: false,
                error: "Failed to fetch comments. Please try again later."
            };
        }
    },

    async addMovieComment(
        movieId: string | string[] | undefined,
        content: string
    ): Promise<AddCommentResponse> {
        if (!movieId || (Array.isArray(movieId) && movieId.length === 0)) {
            return {
                data: null,
                isLoading: false,
                error: "Invalid movie ID provided"
            };
        }

        if (!content) {
            return {
                data: null,
                isLoading: false,
                error: "Content is required"
            };
        }

        try {
            const response = await api.post<Comment>(
                `movies/movies/${Array.isArray(movieId) ? movieId[0] : movieId}/comments`,
                { content }
            );
            return {
                data: response.data,
                isLoading: false,
                error: null
            };
        } catch (error) {
            console.log("Failed to post comment:", error);
            return {
                data: null,
                isLoading: false,
                error: "Failed to post comment. Please try again later."
            };
        }
    },

    async updateMovieComment(
        commentId: string,
        content: string
    ): Promise<UpdateCommentResponse> {
        if (!commentId) {
            return {
                data: null,
                isLoading: false,
                error: "Invalid comment ID provided"
            };
        }

        if (!content) {
            return {
                data: null,
                isLoading: false,
                error: "Content is required"
            };
        }

        try {
            const response = await api.put<Comment>(
                `movies/comments/${commentId}`,
                { content }
            );
            return {
                data: response.data,
                isLoading: false,
                error: null
            };
        } catch (error) {
            console.log("Failed to update comment:", error);
            return {
                data: null,
                isLoading: false,
                error: "Failed to update comment. Please try again later."
            };
        }
    },

    async deleteMovieComment(
        commentId: string
    ): Promise<DeleteCommentResponse> {
        if (!commentId) {
            return {
                isLoading: false,
                error: "Invalid comment ID provided"
            };
        }

        try {
            await api.delete(`movies/comments/${commentId}`);
            return {
                isLoading: false,
                error: null
            };
        } catch (error) {
            console.log("Failed to delete comment:", error);
            return {
                isLoading: false,
                error: "Failed to delete comment. Please try again later."
            };
        }
    },
};