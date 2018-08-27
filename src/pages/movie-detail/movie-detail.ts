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
import { MovieCredits } from "../../models/movieCredits.model";

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
    currentMovieCast$: Observable<MovieCredits>;
    movieInWatchList$: boolean;
    movieInFavouritesList$: boolean;

    loading: Loading;

    constructor(
        private navParams: NavParams,
        private nav: NavController,
        private loadingCtrl: LoadingController,
        private firestore: FirestoreProvider,
        private auth: AuthenticationProvider,
        private alert: AlertController
    ) {
        this.currentMovie$ = this.navParams.get("movieObservable"); // Connect the movie observable.
        this.currentMovieCast$ = this.navParams.get("movieCastObservable"); // Connect the movie cast observable

        this.movieInWatchList$ = false;
        this.movieInFavouritesList$ = false;

        this.currentMovie$.subscribe(movie => {
            console.log("Watchlist or favourites updated...");
            this.isMovieInWatchlist(movie.id);
            this.isMovieInFavouriteslist(movie.id);
        });
    }

    toggleWatchlistItem(movieId: number, add: boolean): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("Watchlist");
            return;
        }

        this.movieInWatchList$ = add;
        this.firestore.toggleWatchlistItem(movieId, add);
    }

    toggleFavouritesItem(movieId: number, add: boolean): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("Favourites");
            return;
        }
        this.movieInFavouritesList$ = add;
        this.firestore.toggleFavouritesItem(movieId, add);
    }

    isMovieInWatchlist(movieId: number): void {
        console.log("Inside isMovieInWatchlist() with movieId: " + movieId);

        if (!this.auth.isAuthenticated()) {
            return; // Not logged in, dont need to check favourites list status.
        }

        this.firestore.getList("watchlist").then(movies => {
            this.movieInWatchList$ = movies.indexOf(movieId) !== -1;
        });
    }

    isMovieInFavouriteslist(movieId: number): void {
        if (!this.auth.isAuthenticated()) {
            return; // Not logged in, dont need to check favourites list status.
        }

        this.firestore.getList("favourites").then(movies => {
            this.movieInFavouritesList$ = movies.indexOf(movieId) !== -1;
        });
    }

    isAuthenticated(): boolean {
        return this.auth.isAuthenticated();
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

    getMinToHours(minutes: number) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var hours = h < 10 ? "0" + h : h;
        var mins = m < 10 ? "0" + m : m;
        return h + "h " + m + "m";
    }
}
