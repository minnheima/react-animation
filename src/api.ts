const API_KEY = "8372c1aa1a42a9e3d8624b2800a0d4d1";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  popularity: number;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  original_name: string;
  release_date: string;
  media_type: string;
}

export interface IGetMoviesResult {
  date: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMultiSearch {
  results: IMovie[];
}
interface IGenres {
  id: number;
  name: string;
}
interface ICompanies {
  id: number;
  name: string;
  logo_path: string;
}

export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  genres: IGenres[];
  homepage: string;
  id: number;
  production_companies: ICompanies[];
  title: string;
  vote_average: number;
  overview: string;
  poster_path?: string;
  name: string;
  runtime: number;
  number_of_seasons: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}

export function getSearch(keyword: string | null) {
  return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}`).then((response) =>
    response.json()
  );
}

export function getMovieGenres() {
  return fetch(`${BASE_PATH}/genre/movie.list?api_key=${API_KEY}`).then((response) => response.json());
}
