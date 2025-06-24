import { useFetch } from "../react-query";
import * as url from "../urlHelper";

// This hook fetches the list of movies based on the id and API provider.
export const useMovieDetails = (id: string, apiprovider : string) => useFetch(`${url.GET_MOVIE_DETAILS}/${apiprovider}${id}`);
