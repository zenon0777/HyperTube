import { useFetch } from "../react-query";
import * as url from "../urlHelper";
export const getMovieDetails = (search: string | string[]) => useFetch(`${url.GET_MOVIE_DETAILS}/${search}`);
