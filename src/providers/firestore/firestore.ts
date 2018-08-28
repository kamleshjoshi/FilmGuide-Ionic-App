import { Review } from "./../../models/review.model";
import { AngularFirestore } from "angularfire2/firestore";
import { AuthenticationProvider } from "./../authentication/authentication";
import { Injectable } from "@angular/core";

@Injectable()
export class FirestoreProvider {
    constructor(
        private auth: AuthenticationProvider,
        private firestore: AngularFirestore
    ) {}

    addMovieReview(movieId: string, review: Review) {
        console.log("MOVIEID IN FIRESTORE:" + movieId);

        this.getMovieReviews(movieId).then(reviewsArray => {
            reviewsArray.unshift(review);
            this.firestore.doc("movies/" + movieId).set(
                {
                    reviews: reviewsArray
                },
                {
                    merge: true
                }
            );
        });
    }

    addMovieRating(movieId: string, rating: number, tmdbAverage: number) {
        this.getMovieRatings(movieId, tmdbAverage).then(ratingsArray => {
            ratingsArray.push(rating);
            this.firestore.doc("movies/" + movieId).set(
                {
                    ratings: ratingsArray
                },
                { merge: true }
            );
        });
    }

    toggleWatchlistItem(movieId: number, add: boolean) {
        const userId = this.auth.getUserID();

        this.getList("watchlist").then(watchlist => {
            var filteredWatchlist: number[];

            if (!add && watchlist.indexOf(movieId) !== -1) {
                filteredWatchlist = watchlist;
                // Remove movie id from favourites array.
                filteredWatchlist.splice(filteredWatchlist.indexOf(movieId), 1);
            } else if (add) {
                var dirtyWatchlist = [...watchlist, movieId];
                filteredWatchlist = Array.from(new Set(dirtyWatchlist));
            } else {
                console.log("ERROR: ****************************************");
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

    toggleFavouritesItem(movieId: number, add: boolean) {
        const userId = this.auth.getUserID();

        this.getList("favourites").then(favourites => {
            var filteredFavouriteslist: number[];

            // Remove movie id from favourites array.
            if (!add && favourites.indexOf(movieId) !== -1) {
                filteredFavouriteslist = favourites;
                filteredFavouriteslist.splice(favourites.indexOf(movieId), 1);
            } else if (add) {
                var dirtyfavouriteslist = [...favourites, movieId];
                filteredFavouriteslist = Array.from(
                    new Set(dirtyfavouriteslist)
                );
            } else {
                console.log("ERROR: ****************************************");
                return;
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

    getMovieReviews(movieId: string) {
        return new Promise<Review[]>((resolve, reject) => {
            this.firestore
                .collection("movies")
                .doc(movieId.toString())
                .ref.get()
                .then(function(doc) {
                    if (doc.exists) {
                        resolve(doc.data().reviews || []);
                    } else {
                        console.log(
                            "Document not found, resolving empty array"
                        );
                        resolve([]);
                    }
                })
                .catch(function(error) {
                    reject("Error getting document: " + error);
                });
        });
    }

    getMovieRatings(movieId: string, tmdbAverage: number) {
        let halved = tmdbAverage / 2;

        return new Promise<number[]>((resolve, reject) => {
            this.firestore
                .collection("movies")
                .doc(movieId.toString())
                .ref.get()
                .then(function(doc) {
                    if (doc.exists) {
                        resolve(doc.data().ratings || [halved]);
                    } else {
                        console.log(
                            "Document not found, resolving empty array"
                        );
                        resolve([halved]);
                    }
                })
                .catch(function(error) {
                    reject("Error getting document: " + error);
                });
        });
    }
}
