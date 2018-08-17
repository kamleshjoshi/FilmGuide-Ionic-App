import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticationProvider } from './../authentication/authentication';
import { UserAccount } from './../../models/userAccount.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FirestoreProvider {

  constructor(private auth: AuthenticationProvider, private firestore: AngularFirestore) {
    console.log('Hello FirestoreProvider Provider');
  }

  addToWatchlist(movieId: number){

    // const userId = this.auth.getUserID(); 

    // return this.firestore.doc(`users/${userId}`).set({
    //   userId,
    //   watchlist: movieId
    // });

  }
}
