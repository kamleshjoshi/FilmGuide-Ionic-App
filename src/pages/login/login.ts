import { HomePage } from "./../home/home";
import { RegisterPage } from "./../register/register";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage {
    user = {} as User;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private afAuth: AngularFireAuth
    ) {}

    ionViewDidLoad() {
        console.log("ionViewDidLoad LoginPage");
    }

    async login(user: User) {
        try {
            const result = this.afAuth.auth.signInWithEmailAndPassword(
                user.email,
                user.password
            );
            if (result) {
                this.navCtrl.setRoot(HomePage);
            }
        } catch (e) {
            //console.log(e);
        }
    }

    register() {
        this.navCtrl.push(RegisterPage);
    }
}
