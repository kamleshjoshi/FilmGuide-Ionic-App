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

    constructor(private navCtrl: NavController, private navParams: NavParams) {}

    ionViewDidLoad() {
        this.currentActorDetails$ = this.navParams.get("currentActorDetails");
        this.currentActorCredits$ = this.navParams.get("currentActorCredits");
        this.actorName = this.navParams.get("actorName");
    }
}
