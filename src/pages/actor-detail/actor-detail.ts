import { MovieDbProvider } from "./../../providers/movie-db/movie-db";
import { MovieDetailPage } from "./../movie-detail/movie-detail";
import { ActorCredits } from "./../../models/actorCredits.model";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Observable } from "rxjs";
import { ActorDetail } from "../../models/actorDetail.model";

@IonicPage()
@Component({
    selector: "page-actor-detail",
    templateUrl: "actor-detail.html"
})
export class ActorDetailPage {
    currentActorDetails$: Observable<ActorDetail>;
    currentActorCredits$: Observable<ActorCredits>;
    actorName: string = "Loading...";

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private movieDbProvider: MovieDbProvider
    ) {}

    ionViewDidLoad() {
        this.currentActorDetails$ = this.navParams.get("currentActorDetails");
        this.currentActorCredits$ = this.navParams.get("currentActorCredits");
        this.actorName = this.navParams.get("actorName");
    }

    openMovieDetail(movieId: string) {
        this.navCtrl.push(MovieDetailPage, {
            movieObservable: this.movieDbProvider.getMovieDetail(movieId),
            movieCastObservable: this.movieDbProvider.getMovieCredits(movieId),
            movieId: movieId
        });
    }
}
