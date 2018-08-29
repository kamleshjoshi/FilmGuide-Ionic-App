import { User } from "../../models/user.model";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class AuthenticationProvider {
    authState = null;

    constructor(private afAuth: AngularFireAuth) {
        console.log("Hello AuthenticationProvider Provider");
        afAuth.authState.subscribe(state => {
            this.authState = state;
        });
    }

    isAuthenticated(): boolean {
        return this.authState;
    }

    login(user: User) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(user.email, user.password)
            .then(usr => {
                this.authState = usr;
            });
    }

    register(user: User) {
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

    getUserID(): string {
        return this.afAuth.auth.currentUser.uid;
    }

    getUserEmail(): string {
        //return "Logged In";
        if (
            this.isAuthenticated() &&
            this.afAuth.auth.currentUser &&
            this.afAuth.auth.currentUser.email
        ) {
            return this.afAuth.auth.currentUser.email;
        } else {
            return "Email Here";
        }
    }

    //Sign user out of
    logout() {
        this.afAuth.auth.signOut();
    }
}
