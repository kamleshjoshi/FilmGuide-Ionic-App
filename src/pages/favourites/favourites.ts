import { MovieDetailPage } from "./../movie-detail/movie-detail";
import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { MovieDetail } from "./../../models/movieDetail.model";
import { Component } from "@angular/core";
import { IonicPage, NavController, AlertController } from "ionic-angular";
import { Observable } from "rxjs";

/**
 * Generated class for the FavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: "page-favourites",
    templateUrl: "favourites.html"
})
export class FavouritesPage {
    favourites$: any[];
    detailedFavourites$: Observable<MovieDetail>[];

    itemLimit: number = 10;

    constructor(
        private navCtrl: NavController,
        private firestore: FirestoreProvider,
        private movieDbProvider: MovieDbProvider,
        private alertCtrl: AlertController
    ) {}

    ionViewWillEnter() {
        this.refreshFavourites();
    }

    refreshFavourites() {
        this.getFavourites().then(() => {
            this.getDetailedFavourites();
        });
    }

    getFavourites() {
        return this.firestore.getList("favourites").then(movies => {
            this.favourites$ = movies;
        });
    }

    getDetailedFavourites() {
        this.detailedFavourites$ = [];
        // Display backwards later to show recently watched first.
        for (var i = 0; i < this.favourites$.length; i++) {
            this.detailedFavourites$.push(
                this.movieDbProvider.getMovieDetail(this.favourites$[i])
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

    removeItemFromFavourites(listLength: number, index: number,movieId: number,movieName: string ) {
        // Flip index due to reversed arrray.
        let indexToDel = listLength - index - 1;
        this.detailedFavourites$.splice(indexToDel, 1);

        // Remove from watchlist
        this.firestore.toggleFavouritesItem(movieId, false);
    }

    doRefresh(refresher) {
        console.log("Begin async operation", refresher);

        this.refreshFavourites();

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
