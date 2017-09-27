// import { Response } from '@angular/http';
import { AuthenticationService } from './../../../services/authentication.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(private viewCtrl: ViewController, private authService: AuthenticationService,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController
  ) {
  }

  onClose() {
    this.viewCtrl.dismiss();
  }
  onForgotPassword(form: NgForm) {
    console.log(form.value);
    const loader = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loader.present();
    this.authService.forgotPassword(form.value.email)
    .subscribe(
      data => {
        loader.dismiss();
        console.log(data.json());
        if (data.json().response == 'fail') {
          this.alert(data.json().actionMessages[0]).present();
        }else{
          this.alert('A link to reset your password has been sent to your email').present();
        }
      },
      err => {
        loader.dismiss();
        console.log(err);
        const alert = this.alertCtrl.create({
          title: 'Can\'t connect to the internet',
          message: 'There might be a problem with your network connection. Please check and try again',
          buttons: ['Ok']
        });
        alert.present();
      }
    );
    form.reset();
  }


    private alert(message: string) {
      let alert = this.alertCtrl.create({
        message: message,
        buttons: [{
          text: 'Ok',
          handler: () => {
          let alertEnd = alert.dismiss();
          alertEnd.then(() => {
            this.viewCtrl.dismiss();
          });
          return false;
        },
        role: 'cancel'
      }]
    });
      return alert;
    }
}
