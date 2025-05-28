import { useFetch } from "../react-query";
import * as url from "../urlHelper";

// This function fetches the list of movies based on the id and API provider.
export const getMovieDetails = (id: string, apiprovider : string) => useFetch(`${url.GET_MOVIE_DETAILS}/${apiprovider}${id}`);
