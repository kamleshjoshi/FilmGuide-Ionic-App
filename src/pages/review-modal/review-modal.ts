import { Review } from "./../../models/review.model";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavParams,
    ViewController,
    AlertController
} from "ionic-angular";
import * as moment from "moment";

@IonicPage()
@Component({
    selector: "page-review-modal",
    templateUrl: "review-modal.html"
})
export class ReviewModalPage {
    review = {} as Review;

    movieId: string;

    constructor(
        private navParams: NavParams,
        private view: ViewController,
        private firestore: FirestoreProvider,
        private alert: AlertController
    ) {
        this.movieId = this.navParams.get("movieId");
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad ReviewModalPage");
    }

    submitReview(review: Review) {
        if (!review.username || !review.grade || !review.reviewText) {
            this.alert
                .create({
                    subTitle:
                        "Please enter all review details to submit review",
                    buttons: ["Dismiss"]
                })
                .present();
            return;
        }

        review.date = moment().format("Do MMMM YYYY"); // August 27th 2018, 11:57:44 pm
        this.firestore.addMovieReview(this.movieId, review);
        this.closeReviewModal();
    }

    closeReviewModal() {
        this.view.dismiss();
    }
}
