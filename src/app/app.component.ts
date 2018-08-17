import { AuthenticationProvider } from "./../providers/authentication/authentication";
import { HomePage } from "./../pages/home/home";
import { LoginPage } from "./../pages/login/login";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, ToastController, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { RegisterPage } from "../pages/register/register";
import { ListPage } from "../pages/list/list";

@Component({
    templateUrl: "app.html"
})
export class MyApp {
    @ViewChild(Nav)
    nav: Nav;

    rootPage: any = HomePage;
    pages: Array<{ title: string; component: any }>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        private auth: AuthenticationProvider,
        private toast: ToastController,
        private alert: AlertController
    ) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: "Browse", component: HomePage },
            { title: "Watchlist", component: ListPage },
            { title: "Favourites", component: HomePage },
            { title: "My Recommendations", component: HomePage },
            { title: "About", component: HomePage }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        if (page.title === "Login") {
            this.nav.push(page.component);
            return;
        }

        if (
            (page.title === "Watchlist" ||
                page.title === "Favourites" ||
                page.title === "My Recommendations") &&
            !this.isAuthenticated()
        ) {
            this.alert
                .create({
                    title: "Sign In Required",
                    subTitle: "Please Login to Access this feature.",
                    buttons: [
                        {
                            text: "Sign In",
                            handler: () => {
                                this.login();
                            }
                        },
                        {
                            text: "Sign Up",
                            handler: () => {
                                this.register();
                            }
                        }
                    ]
                })
                .present();
            return;
        }
        this.nav.setRoot(page.component); // User signed in, all options available.
    }

    login() {
        this.nav.push(LoginPage);
    }

    register() {
        this.nav.push(RegisterPage);
    }

    logout() {
        this.auth.logout();
        this.toast
            .create({
                message: "Logged Out Successfully",
                duration: 3000
            })
            .present();
    }

    getUserEmail(): string {
        return "Email Here";
        //return this.auth.getUserEmail() || "Not Signed In";
    }

    isAuthenticated(): boolean {
        return this.auth.isAuthenticated();
    }
}
