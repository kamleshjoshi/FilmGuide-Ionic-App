import { SearchResult } from "./../../models/searchResult.model";
import { SearchResultsPage } from "./../search-results/search-results";
import { MovieDetailPage } from "./../movie-detail/movie-detail";
import { Movies } from "./../../models/movies.model";
import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { Component } from "@angular/core";
import { NavController, Loading } from "ionic-angular";
import { Observable } from "../../../node_modules/rxjs/Observable";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class HomePage {
    nowPlayingMovies$: Observable<Movies>;
    popularMovies$: Observable<Movies>;

    loading: Loading;
    isSearchbarOpen = false;

    constructor(
        private navCtrl: NavController,
        private movieDbProvider: MovieDbProvider
    ) {}

    ionViewWillLoad() {
        this.getNowPlayingMovies();
        this.getPopularMovies();
    }

    getNowPlayingMovies() {
        this.nowPlayingMovies$ = this.movieDbProvider.getNowPlayingMovies();
    }

    getPopularMovies() {
        this.popularMovies$ = this.movieDbProvider.getPopularMovies();
    }

    submitSearch(event) {
        let query: string = event.target.value;

        this.navCtrl.push(SearchResultsPage, {
            searchResultObservable: this.movieDbProvider.getSearchResults(
                query
            ),
            searchQuery: query
        });
    }

    openMovieDetail(movieId: string) {
        this.navCtrl.push(MovieDetailPage, {
            movieObservable: this.movieDbProvider.getMovieDetail(movieId),
            movieCastObservable: this.movieDbProvider.getMovieCredits(movieId),
            movieId: movieId
        });
    }
}
