import { MovieDetail } from "./../../models/movieDetail.model";
import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading
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

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private loadingCtrl: LoadingController
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
}
