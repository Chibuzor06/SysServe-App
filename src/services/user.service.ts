import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { User } from './../models/user.model';

@Injectable()
export class UserService{
  user: User;
  deviceId: string;
  toastShown: boolean = false;
  constructor( private storage: Storage)  {}

  getUser() {
    return this.user;
  }
  setUser(clientCode: string, email: string, firstName: string, lastName: string, token: string) {
    this.user = {
      firstName: firstName, lastName: lastName, email: email, clientCode: clientCode, token: token
    };
    this.storage.set('user', this.user);
    // console.log(this.user);
  }
  setUserWithResponseData(user: User) {
    this.user = user;
    this.storage.set('user', this.user).then(
      data => {
        // console.log('User Stored', data);
      }
    )
    .catch(
      data => {
        // console.log('Error storing user',data);
      }
    );
    console.log('userSet', this.user, );
  }

  getUserToken() {
    if(this.user){
      return this.user.token;
    }
  }

  clearUser() {
    return this.storage.remove('user')
      .then( data => {
        this.user = null;
        this.toastShown = false;
        // this.tripsService.clearTrips();
        return true;
      })
      .catch(
        err => {
          // console.log('Storage error',err);
          return false;
        }
      );
      // return success;
  }

  loggedIn() {
    return this.storage.get('user')
      .then( (user: User) => {
        if (user) {
          this.user = user;
          // console.log(this.user, 'Log in function');
          return { user: true, accessedStorage : true};
        }
        else {
          return { user: false, accessedStorage : true};
        }

      })
      .catch( err => {
        // console.log('Error accessing storage');
        return { user: false, accessedStorage: false};
      });
      // return { user: true, accessedStorage : true};
  }



}
