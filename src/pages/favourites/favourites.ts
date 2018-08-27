import { MovieDetailPage } from "./../movie-detail/movie-detail";
import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { MovieDetail } from "./../../models/movieDetail.model";
import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
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

    constructor(
        private navCtrl: NavController,
        private firestore: FirestoreProvider,
        private movieDbProvider: MovieDbProvider
    ) {}

    ionViewWillLoad() {
        console.log("ionViewDidLoad WatchlistPage");
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
            movieCastObservable: this.movieDbProvider.getMovieCredits(movieId)
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
