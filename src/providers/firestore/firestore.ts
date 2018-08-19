import {
    AngularFirestore,
    AngularFirestoreCollection
} from "angularfire2/firestore";
import { AuthenticationProvider } from "./../authentication/authentication";
import { UserAccount } from "./../../models/userAccount.model";
import { Injectable } from "@angular/core";
import { Observable } from "../../../node_modules/rxjs";

@Injectable()
export class FirestoreProvider {
    users: Observable<UserAccount[]>;
    userCollectionRef: AngularFirestoreCollection<UserAccount>;

    constructor(
        private auth: AuthenticationProvider,
        private firestore: AngularFirestore
    ) {
        console.log("Hello FirestoreProvider Provider");

        this.userCollectionRef = this.firestore.collection("users");
        this.users = this.userCollectionRef.valueChanges();
    }

    // addToWatchlist(movieId: number) {
    //     this.userCollectionRef
    //         .doc(this.auth.getUserID())
    //         .update({ watchlist: watchlist.push(123) });
    // }

    addToWatchlist(movieId: number) {
        const userId = this.auth.getUserID();

        this.getWatchlist(movieId).then(watchlist => {
            this.firestore.doc(`users/${userId}`).set({
                userId,
                watchlist: [...watchlist, movieId] // Get current watchlist array and append movie id to it.
            });
        });
    }

    getWatchlist(movieId: number) {
        return new Promise<any[]>((resolve, reject) => {
            this.firestore
                .collection("users")
                .doc(this.auth.getUserID())
                .ref.get()
                .then(function(doc) {
                    if (doc.exists) {
                        resolve(doc.data().watchlist || []);
                    } else {
                        reject("Document not found");
                    }
                })
                .catch(function(error) {
                    reject("Error getting document: " + error);
                });
        });
    }
}
