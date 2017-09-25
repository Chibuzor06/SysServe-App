import { AuthenticationService } from './../../../services/authentication.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController, AlertController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private viewCtrl: ViewController, private loadingCtrl: LoadingController,
    private authService: AuthenticationService, private alertCtrl: AlertController
  ) {
  }

  onClose() {
    this.viewCtrl.dismiss();
  }

  onSignUp(form: NgForm) {
    console.log(form);
    const loader = this.loadingCtrl.create({
      content: 'Creating new user...'
    });
    loader.present();
    this.authService.createNewUser(form.value.firstName, form.value.lastName, form.value.email,
      form.value.phone, form.value.clientCode)
      .subscribe(
        data => {
          loader.dismiss();
          const data1 = data.json();
          if(data1.response == 'fail') {
            const alert = this.alertCtrl.create({
              title: 'Sigup Failed',
              message: data1.actionMessages[0],
              buttons: ['Ok']
            });
            alert.present();
          } else {
            console.log('data here', data1);
            // this.userService.setUserWithResponseData(data);
            // this.navCtrl.setRoot('WelcomePage');
          }
          console.log(data.json());
        },
        err => {
          loader.dismiss();
          console.log('This is an error', err);
        }
      );
  }
}
