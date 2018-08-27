import { FirestoreProvider } from "./../../providers/firestore/firestore";
import { HomePage } from "./../home/home";
import { AuthenticationProvider } from "./../../providers/authentication/authentication";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    ToastController,
    MenuController
} from "ionic-angular";
import { User } from "../../models/user.model";

@IonicPage()
@Component({
    selector: "page-register",
    templateUrl: "register.html"
})
export class RegisterPage {
    user = {} as User;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private auth: AuthenticationProvider,
        private toast: ToastController,
        private menu: MenuController,
        private firestore: FirestoreProvider
    ) {
        this.menu.swipeEnable(false);
    }

    register(user: User) {
        this.auth
            .register(user)
            .then(() => {
                // firestore.addUser() here...???
                this.toast
                    .create({
                        message: "Registered and Logged in successfully",
                        duration: 3000
                    })
                    .present();
                this.navCtrl.setRoot(HomePage); // Send user to home page if successful...
            })
            .catch(error => {
                this.toast
                    .create({
                        message: "Error: " + error.message,
                        duration: 3000
                    })
                    .present();
            });
    }
}
