import { RegisterPage } from "./../register/register";
import { LoginPage } from "./../login/login";
import { AuthenticationProvider } from "./../../providers/authentication/authentication";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { MovieDetail } from "./../../models/movieDetail.model";
import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading,
    AlertController
} from "ionic-angular";
import { Observable } from "../../../node_modules/rxjs/Observable";

/**
 * Generated class for the MovieDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: "page-movie-detail",
    templateUrl: "movie-detail.html"
})
export class MovieDetailPage {
    currentMovie$: Observable<MovieDetail>;
    isMovieInWatchListHm: Promise<boolean>;
    loading: Loading;

    movieInWatchList$: boolean;
    movieInFavouritesList$: boolean;

    constructor(
        private navParams: NavParams,
        private nav: NavController,
        private loadingCtrl: LoadingController,
        private firestore: FirestoreProvider,
        private auth: AuthenticationProvider,
        private alert: AlertController
    ) {
        // Constructor code here...
    }

    ionViewDidLoad() {
        this.currentMovie$ = this.navParams.get("movieObservable"); // Connect the movie observable.
    }

    presentLoading() {
        if (!this.loading) {
            console.log("Presenting loading...");
            this.loading = this.loadingCtrl.create({
                content: "Loading Movie Details...",
                dismissOnPageChange: true
            });
            this.loading.present();
        }
    }

    toggleWatchlistItem(movieId: number): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("Watchlist");
            return;
        }

        this.firestore.toggleWatchlistItem(movieId);
    }

    toggleFavouritesItem(movieId: number): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("Favourites");
            return;
        }
        this.firestore.toggleFavouritesItem(movieId);
    }

    isMovieInWatchlist(movieId: number): Promise<boolean> {
        if (!this.auth.isAuthenticated()) {
            //FIXME - ADD ALERT TO SIGNIN
            //return false;
            throw new Error("no");
        }

        return this.firestore.getList("watchlist").then(movies => {
            return movies.indexOf(movieId) !== -1;
        });
    }

    isMovieInFavouriteslist(movieId: number): Promise<boolean> {
        if (!this.auth.isAuthenticated()) {
            //FIXME - ADD ALERT TO SIGNIN
            //return false;
            throw new Error("no");
        }

        return this.firestore.getList("favourites").then(movies => {
            return movies.indexOf(movieId) !== -1;
        });
    }

    displayFeatureUnavailable(feature: string): void {
        this.alert
            .create({
                title: "Sign In Required",
                subTitle: "Please Login to add Movie to " + feature,
                buttons: [
                    {
                        text: "Sign In",
                        handler: () => {
                            this.nav.push(LoginPage);
                        }
                    },
                    {
                        text: "Sign Up",
                        handler: () => {
                            this.nav.push(RegisterPage);
                        }
                    }
                ]
            })
            .present();
    }

    getMinToHours(minutes: number) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var hours = h < 10 ? "0" + h : h;
        var mins = m < 10 ? "0" + m : m;
        return h + "h " + m + "m";
    }
}
