import { SearchResult } from "./../../models/searchResult.model";
import { MovieCredits } from "./../../models/movieCredits.model";
import { HttpClient } from "@angular/common/http";
import { MovieDetail } from "./../../models/movieDetail.model";
import { Movies } from "./../../models/movies.model";
import { Injectable } from "@angular/core";

@Injectable()
export class MovieDbProvider {
    private API_URL = "https://api.themoviedb.org/3/";
    private API_KEY = "?api_key=06e6d6beb266b3923900774542fec7bc";

    private NOW_PLAYING_MOVIES = "movie/now_playing";
    private POPULAR_MOVIES = "movie/popular";
    private MOVIE_DETAIL = "movie/";

    constructor(private http: HttpClient) {
        console.log("Hello MovieDbProvider Provider");
    }

    getNowPlayingMovies() {
        console.log("Getting now playing movies");
        return this.http.get<Movies>(
            this.API_URL + this.NOW_PLAYING_MOVIES + this.API_KEY
        );
    }

    getPopularMovies() {
        console.log("Getting popular movies");
        return this.http.get<Movies>(
            this.API_URL + this.POPULAR_MOVIES + this.API_KEY
        );
    }

    getMovieDetail(movieId: string) {
        console.log("Getting movie details for id: " + movieId);
        return this.http.get<MovieDetail>(
            this.API_URL + this.MOVIE_DETAIL + movieId + this.API_KEY
        );
    }

    getMovieCredits(movieId: string) {
        console.log("Getting movie credits for movieId: " + movieId);
        return this.http.get<MovieCredits>(
            this.API_URL + "movie/" + movieId + "/credits" + this.API_KEY
        );
    }

    getSearchResults(searchString: string) {
        console.log("Searching for: " + searchString);
        return this.http.get<SearchResult>(
            this.API_URL +
                "search/movie" +
                this.API_KEY +
                "&query=" +
                searchString
        );
    }
}
