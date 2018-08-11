import { User } from "./../../models/user";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
    authState = null;

    constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
        console.log("Hello AuthenticationProvider Provider");
        afAuth.authState.subscribe(state => {
            this.authState = state;
        });
    }

    isAuthenticated(): boolean {
        return this.authState;
    }

    async login(user: User) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(user.email, user.password)
            .then(usr => {
                this.authState = usr;
            });
    }

    async register(user: User) {
        return this.afAuth.auth
            .createUserAndRetrieveDataWithEmailAndPassword(
                user.email,
                user.password
            )
            .then(usr => {
                this.authState = usr;
                return usr;
            });
    }

    getUserEmail(): string {
        return "User Email Here";
    }

    //Sign user out of
    logout() {
        this.afAuth.auth.signOut();
    }
}
