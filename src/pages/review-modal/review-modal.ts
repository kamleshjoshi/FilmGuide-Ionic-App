import { Review } from "./../../models/review.model";
import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavParams,
    ViewController,
    AlertController,
    ToastController
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
    movieName: string;

    constructor(
        private navParams: NavParams,
        private view: ViewController,
        private firestore: FirestoreProvider,
        private alert: AlertController,
        private toast: ToastController
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

        this.toast
            .create({
                message: "Review Added Successfully - Pull down to refresh!",
                duration: 3000
            })
            .present();

        this.closeReviewModal();
    }

    closeReviewModal() {
        this.view.dismiss();
    }
}
