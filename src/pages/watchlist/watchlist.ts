import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { Movies } from "./../../models/movies.model";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { Observable } from "../../../node_modules/rxjs";
import { MovieDetail } from "../../models/movieDetail.model";
import { MovieDetailPage } from "../movie-detail/movie-detail";

/**
 * Generated class for the WatchlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: "page-watchlist",
    templateUrl: "watchlist.html"
})
export class WatchlistPage {
    watchlist$: any[];
    detailedWatchlist$: Observable<MovieDetail>[];

    constructor(
        private navCtrl: NavController,
        private firestore: FirestoreProvider,
        private movieDbProvider: MovieDbProvider
    ) {}

    ionViewWillLoad() {
        console.log("ionViewDidLoad WatchlistPage");
        this.getWatchlist().then(() => {
            this.getDetailedWatchList();
        });
    }

    getWatchlist() {
        return this.firestore.getList("watchlist").then(movies => {
            this.watchlist$ = movies;
        });
    }

    getDetailedWatchList() {
        this.detailedWatchlist$ = [];
        // Display backwards later to show recently watched first.
        for (var i = 0; i < this.watchlist$.length; i++) {
            this.detailedWatchlist$.push(
                this.movieDbProvider.getMovieDetail(this.watchlist$[i])
            );
        }
    }

    openMovieDetail(movieId: string) {
        this.navCtrl.push(MovieDetailPage, {
            movieObservable: this.movieDbProvider.getMovieDetail(movieId),
            movieCastObservable: this.movieDbProvider.getMovieCredits(movieId),
            movieId: movieId
        });
    }

    getMinToHours(minutes: number) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var hours = h < 10 ? "0" + h : h;
        var mins = m < 10 ? "0" + m : m;
        return h + "h " + m + "m";
    }
}
