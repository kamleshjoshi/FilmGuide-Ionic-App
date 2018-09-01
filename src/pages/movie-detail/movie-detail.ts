import { RatingModalPage } from "./../rating-modal/rating-modal";
import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { ActorDetailPage } from "./../actor-detail/actor-detail";
import { Review } from "./../../models/review.model";
import { ReviewModalPage } from "./../review-modal/review-modal";
import { RegisterPage } from "./../register/register";
import { LoginPage } from "./../login/login";
import { AuthenticationProvider } from "./../../providers/authentication/authentication";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { MovieDetail } from "./../../models/movieDetail.model";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading,
    AlertController,
    ModalController
} from "ionic-angular";
import { Observable } from "../../../node_modules/rxjs/Observable";
import { MovieCredits } from "../../models/movieCredits.model";

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

    averageRating: number;

    loading: Loading;
    currentMovieReviews: Review[];

    movieId: string;

    constructor(
        private navParams: NavParams,
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private firestore: FirestoreProvider,
        private auth: AuthenticationProvider,
        private alert: AlertController,
        private modalCtrl: ModalController,
        private movieDbProvider: MovieDbProvider
    ) {
        this.currentMovie$ = this.navParams.get("movieObservable"); // Connect the movie observable.
        this.currentMovieCast$ = this.navParams.get("movieCastObservable"); // Connect the movie cast observable

        this.movieId = this.navParams.get("movieId");

        this.firestore
            .getMovieReviews(this.navParams.get("movieId"))
            .then(reviews => {
                this.currentMovieReviews = reviews;
            });

        this.movieInWatchList$ = false;
        this.movieInFavouritesList$ = false;

        this.currentMovie$.subscribe(movie => {
            this.isMovieInWatchlist(movie.id);
            this.isMovieInFavouriteslist(movie.id);

            this.getAverageRating(movie.vote_average).then(average => {
                this.averageRating = average;
                console.log("Average updated: " + this.averageRating);
            });
        });
    }

    toggleWatchlistItem(movieId: number, add: boolean): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("add movie to watchlist");
            return;
        }

        this.movieInWatchList$ = add;
        this.firestore.toggleWatchlistItem(movieId, add);
    }

    toggleFavouritesItem(movieId: number, add: boolean): void {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("add movie to favourites");
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

    displayReviewModal() {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("submit a movie review");
            return;
        }

        const reviewModal = this.modalCtrl.create(
            ReviewModalPage,
            {
                movieId: this.movieId
            },
            { cssClass: "review-modal" }
        );
        reviewModal.present();
    }

    displayRatingsModal(tmdbRating: number) {
        if (!this.auth.isAuthenticated()) {
            this.displayFeatureUnavailable("rate a movie");
            return;
        }

        const ratingModal = this.modalCtrl.create(
            RatingModalPage,
            {
                movieId: this.movieId,
                tmdbRating: tmdbRating,
                averageRating: this.averageRating
            },
            { cssClass: "rating-modal" }
        );
        ratingModal.present();
    }

    async getAverageRating(tmdbRating: number) {
        const ratings = await this.firestore.getMovieRatings(
            this.movieId,
            tmdbRating
        );

        let sum = ratings.reduce((previous, current) => (current += previous));
        let avg = sum / ratings.length;
        return avg;
    }

    openActorDetail(castId: string, actorName: string) {
        this.navCtrl.push(ActorDetailPage, {
            currentActorDetails: this.movieDbProvider.getActorDetails(castId),
            currentActorCredits: this.movieDbProvider.getActorCredits(castId),
            actorName: actorName
        });
    }

    doRefresh(refresher) {
        console.log("Begin async operation", refresher);

        // Refresh reviews
        this.firestore
            .getMovieReviews(this.navParams.get("movieId"))
            .then(reviews => {
                this.currentMovieReviews = reviews;
            });

        // Refresh ratings
        this.getAverageRating(parseInt(this.movieId)).then(average => {
            this.averageRating = average;
            console.log("Average updated: " + this.averageRating);
        });

        setTimeout(() => {
            console.log("Async operation has ended");
            refresher.complete();
        }, 2000);
    }

    displayFeatureUnavailable(feature: string): void {
        this.alert
            .create({
                title: "Sign In Required",
                subTitle: "Please Login to " + feature,
                buttons: [
                    {
                        text: "Sign In",
                        handler: () => {
                            this.navCtrl.push(LoginPage);
                        }
                    },
                    {
                        text: "Sign Up",
                        handler: () => {
                            this.navCtrl.push(RegisterPage);
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
