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
              title: 'Signup Failed',
              message: data1.actionMessages[0],
              buttons: ['Ok']
            });
            alert.present();
          } else {
            const alert = this.alertCtrl.create({
              title: 'Signup Successful',
              message: 'An email has been sent to the indicated email address to set up your password.',
              buttons: ['Ok']
            });
            alert.present();
            alert.onDidDismiss(
              () => {
                this.onClose();
              }
            );
            this.onClose();
            console.log('data here', data1);
          }
          console.log(data.json());
        },
        err => {
          loader.dismiss();
          console.log('This is an error', err);
          const alert = this.alertCtrl.create({
            title: 'Can\'t connect to the internet',
            message: 'There might be a problem with your network connection. Please check and try again',
            buttons: ['Ok']
          });
          alert.present();
        }
      );
  }
}
