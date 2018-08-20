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
        this.movieInWatchList$ = false;
        this.movieInFavouritesList$ = false;
    }

    ionViewWillEnter() {
        console.log("Entering movie details page");
        this.currentMovie$ = this.navParams.get("movieObservable"); // Connect the movie observable.

        this.currentMovie$.subscribe( movie => {
            this.isMovieInWatchlist(movie.id);
            this.isMovieInFavouriteslist(movie.id);
        });
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

        this.movieInWatchList$ = !this.movieInWatchList$;
        this.firestore.toggleWatchlistItem(movieId);
    }

    toggleFavouritesItem(movieId: number): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("Favourites");
            return;
        }
        this.movieInFavouritesList$ = !this.movieInFavouritesList$;
        this.firestore.toggleFavouritesItem(movieId);
    }

    isMovieInWatchlist(movieId: number): void {

        console.log("Inside isMovieInWatchlist() with movieId: " + movieId);

        if (!this.auth.isAuthenticated()) {
            return; // Not logged in, dont need to check favourites list status.
            //throw new Error("Error - User Not logged in, Cannot check watchlist");
        }

        this.firestore.getList("watchlist").then(movies => {
            this.movieInWatchList$ = movies.indexOf(movieId) === 1;

        });
    }

    isMovieInFavouriteslist(movieId: number): void{
        if (!this.auth.isAuthenticated()) {
            return; // Not logged in, dont need to check favourites list status.
            //throw new Error("Error - User Not logged in, Cannot check watchlist");
        }

        this.firestore.getList("favourites").then(movies => {
           this.movieInFavouritesList$ = movies.indexOf(movieId) === -1;
        });
    }

    isAuthenticated(): boolean{
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

    getMinToHours(minutes: number) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var hours = h < 10 ? "0" + h : h;
        var mins = m < 10 ? "0" + m : m;
        return h + "h " + m + "m";
    }
}
