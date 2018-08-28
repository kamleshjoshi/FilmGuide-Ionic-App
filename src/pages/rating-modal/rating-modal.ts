import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { Component, Input } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    ViewController,
    ToastController
} from "ionic-angular";

/**
 * Generated class for the RatingModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: "page-rating-modal",
    templateUrl: "rating-modal.html"
})
export class RatingModalPage {
    movieId: string;
    tmdbAverage: number;

    averageRating: number;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private firestore: FirestoreProvider,
        private view: ViewController,
        private toast: ToastController
    ) {
        this.movieId = this.navParams.get("movieId");
        this.tmdbAverage = this.navParams.get("tmdbRating");
        this.averageRating = this.navParams.get("averageRating");
        console.log("average rating: " + this.averageRating);
    }

    rateMovie(rating) {
        //Add safety check for submission...
        this.firestore.addMovieRating(this.movieId, rating, this.tmdbAverage);

        this.toast
            .create({
                message:
                    "Rating Added Successfully - Pull down to refresh rating!",
                duration: 3000
            })
            .present();

        this.closeRatingModal();
    }

    closeRatingModal() {
        // To do, display toast..

        this.view.dismiss();
    }
}
