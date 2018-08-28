import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    ViewController
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

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private firestore: FirestoreProvider,
        private view: ViewController
    ) {
        this.movieId = this.navParams.get("movieId");
        this.tmdbAverage = this.navParams.get("tmdbRating");
    }

    rateMovie(rating: number) {
        // Add safety check for submission...
        this.firestore.addMovieRating(this.movieId, rating, this.tmdbAverage);

        this.closeRatingModal();
    }

    closeRatingModal() {
        this.view.dismiss();
    }
}
