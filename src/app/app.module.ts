import { ActorDetailPage } from "./../pages/actor-detail/actor-detail";
import { SearchResultsPage } from "./../pages/search-results/search-results";
import { ReviewModalPage } from "./../pages/review-modal/review-modal";
import { FavouritesPage } from "./../pages/favourites/favourites";

import { WatchlistPage } from "./../pages/watchlist/watchlist";
import { AngularFirestoreModule } from "angularfire2/firestore";
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

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { MovieDbProvider } from "../providers/movie-db/movie-db";
import { AuthenticationProvider } from "../providers/authentication/authentication";
import { FirestoreProvider } from "../providers/firestore/firestore";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        MovieDetailPage,
        LoginPage,
        RegisterPage,
        WatchlistPage,
        FavouritesPage,
        ReviewModalPage,
        SearchResultsPage,
        ActorDetailPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule,
        AngularFireModule.initializeApp(FIREBASE_CONFIG), // Initialise AngularFireModule with Firebase Config
        AngularFireAuthModule,
        AngularFirestoreModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        MovieDetailPage,
        LoginPage,
        RegisterPage,
        WatchlistPage,
        FavouritesPage,
        ReviewModalPage,
        SearchResultsPage,
        ActorDetailPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        MovieDbProvider,
        FirestoreProvider,
        AuthenticationProvider,
        AngularFirestoreModule
    ]
})
export class AppModule {}
