import { HomePage } from "./../home/home";
import { AuthenticationProvider } from "./../../providers/authentication/authentication";
import { RegisterPage } from "./../register/register";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    ToastController,
    MenuController
} from "ionic-angular";
import { User } from "../../models/user.model";

@IonicPage()
@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage {
    user = {} as User;

    constructor(
        private navCtrl: NavController,
        private auth: AuthenticationProvider,
        private toast: ToastController,
        private menu: MenuController
    ) {
        this.menu.swipeEnable(false);
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad LoginPage");
    }

    login(user: User) {
        this.auth
            .login(user)
            .then(() => {
                this.toast
                    .create({
                        message: "Logged in successfully",
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

    register() {
        this.navCtrl.push(RegisterPage);
    }
}
