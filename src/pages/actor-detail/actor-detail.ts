import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
    selector: "page-actor-detail",
    templateUrl: "actor-detail.html"
})
export class ActorDetailPage {
    //currentActor$ = Observable;

    constructor(private navCtrl: NavController, private navParams: NavParams) {}

    ionViewDidLoad() {
        console.log("ionViewDidLoad ActorDetailPage");
    }
}
