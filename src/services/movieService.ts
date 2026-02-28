import axios from "axios";

import type { Movie } from "../types/movie";

export interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const handleFetch = async (query: string, page: number): Promise<MoviesHttpResponse> => {
  const response = await axios.get<MoviesHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: query,
        page
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
};
