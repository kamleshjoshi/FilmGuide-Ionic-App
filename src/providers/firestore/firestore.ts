import { AngularFirestore } from "angularfire2/firestore";
import { AuthenticationProvider } from "./../authentication/authentication";
import { Injectable } from "@angular/core";

@Injectable()
export class FirestoreProvider {
    constructor(
        private auth: AuthenticationProvider,
        private firestore: AngularFirestore
    ) {}

    toggleWatchlistItem(movieId: number) {
        const userId = this.auth.getUserID();

        this.getList("watchlist").then(watchlist => {
            var filteredWatchlist: number[];

            // Remove movie id from favourites array.
            if (watchlist.indexOf(movieId) !== -1) {
                filteredWatchlist = watchlist;
                filteredWatchlist.splice(filteredWatchlist.indexOf(movieId), 1);
            } else {
                var dirtyWatchlist = [...watchlist, movieId];
                filteredWatchlist = Array.from(new Set(dirtyWatchlist));
            }

            this.firestore.doc(`users/${userId}`).set(
                {
                    userId,
                    watchlist: filteredWatchlist
                },
                { merge: true } // Merge document if it already exists
            );
        });
    }

    toggleFavouritesItem(movieId: number) {
        const userId = this.auth.getUserID();

        this.getList("favourites").then(favourites => {
            var filteredFavouriteslist: number[];

            // Remove movie id from favourites array.
            if (favourites.indexOf(movieId) !== -1) {
                filteredFavouriteslist = favourites;
                filteredFavouriteslist.splice(favourites.indexOf(movieId), 1);
            } else {
                var dirtyfavouriteslist = [...favourites, movieId];
                filteredFavouriteslist = Array.from(
                    new Set(dirtyfavouriteslist)
                );
            }

            this.firestore.doc(`users/${userId}`).set(
                {
                    userId,
                    favourites: filteredFavouriteslist
                },
                { merge: true } // Merge document if it already exists
            );
        });
    }

    getList(listType: string) {
        return new Promise<any[]>((resolve, reject) => {
            this.firestore
                .collection("users")
                .doc(this.auth.getUserID())
                .ref.get()
                .then(function(doc) {
                    if (doc.exists) {
                        if (listType === "watchlist") {
                            resolve(doc.data().watchlist || []);
                        } else if (listType === "favourites") {
                            console.log("Resolving favourites");
                            resolve(doc.data().favourites || []);
                        } else {
                            reject("INVALID LIST TYPE");
                        }
                    } else {
                        console.log(
                            "Document not found, resolving empty array"
                        );
                        resolve([]);
                        //reject("Document not found");
                    }
                })
                .catch(function(error) {
                    reject("Error getting document: " + error);
                });
        });
    }
}
