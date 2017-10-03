import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userSrvc: UserService, private toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewDidEnter() {
    if (!this.userSrvc.toastShown){
      if(this.userSrvc.getUser()) {
        const user: User = this.userSrvc.getUser();
        // console.log(user, 'This is the user');
        const toast = this.toastCtrl.create({
          message: 'Welcome, ' + user.firstName,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        toast.onDidDismiss(
            () => {
              this.userSrvc.toastShown = true;
            }
        );
      }
    }
  }

}
