import { RegisterPage } from "./../pages/register/register";
import { LoginPage } from "./../pages/login/login";
import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AngularFireModule } from "angularfire2";
import { MovieDetailPage } from "./../pages/movie-detail/movie-detail";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { AngularFireAuthModule } from "angularfire2/auth";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { MovieDbProvider } from "../providers/movie-db/movie-db";
import { AuthenticationProvider } from "../providers/authentication/authentication";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        MovieDetailPage,
        LoginPage,
        RegisterPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule,
        AngularFireModule.initializeApp(FIREBASE_CONFIG), // Initialise AngularFireModule with Firebase Config
        AngularFireAuthModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        MovieDetailPage,
        LoginPage,
        RegisterPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        MovieDbProvider,
        AuthenticationProvider
    ]
})
export class AppModule {}
