import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { Movies } from "./../../models/movies.model";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { Component } from "@angular/core";
import { IonicPage, NavController, AlertController } from "ionic-angular";
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

    itemLimit: number = 8;

    constructor(
        private navCtrl: NavController,
        private firestore: FirestoreProvider,
        private movieDbProvider: MovieDbProvider,
        private alertCtrl: AlertController
    ) {}

    ionViewWillEnter() {
        this.refreshWatchlist();
    }

    refreshWatchlist() {
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

    removeItemFromWatchlist(index: number, movieId: number, movieName: string) {
        this.detailedWatchlist$.splice(index, 1);

        // Remove from watchlist
        this.firestore.toggleWatchlistItem(movieId, false);
    }

    openMovieDetail(movieId: string) {
        this.navCtrl.push(MovieDetailPage, {
            movieObservable: this.movieDbProvider.getMovieDetail(movieId),
            movieCastObservable: this.movieDbProvider.getMovieCredits(movieId),
            movieId: movieId
        });
    }

    doRefresh(refresher) {
        console.log("Begin async operation", refresher);

        this.refreshWatchlist();

        setTimeout(() => {
            console.log("Async operation has ended");
            refresher.complete();
        }, 2000);
    }

    doInfinite(infiniteScroll, totalItems) {
        console.log("Begin async operation");

        if (this.itemLimit > totalItems) {
            infiniteScroll.complete();
            return;
        }

        setTimeout(() => {
            this.itemLimit += 6;
            console.log("Async operation has ended");
            infiniteScroll.complete();
        }, 1000);
    }

    getMinToHours(minutes: number) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var hours = h < 10 ? "0" + h : h;
        var mins = m < 10 ? "0" + m : m;
        return h + "h " + m + "m";
    }
}
