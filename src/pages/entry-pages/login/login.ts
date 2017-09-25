import { UserService } from './../../../services/user.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  platform: Platform;
  constructor(private modalCtrl: ModalController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private userService: UserService,
    platform: Platform
  ) {
    this.platform = platform;
  }

  onForgotPassword(){
    const resetModal = this.modalCtrl.create('ForgotPasswordPage');
    resetModal.present();
    resetModal.onDidDismiss(() => {});
  }

  onRegister() {
    const signUpModal = this.modalCtrl.create('SignupPage');
    signUpModal.present();
    signUpModal.onDidDismiss(() => {});
  }

  onLogin(form: NgForm) {
    // this.navCtrl.setRoot('WelcomePage');
    console.log(form.value);
    const loader = this.loadingCtrl.create({
      content: 'Logging you in...'
    });
    loader.present();
    this.authService.login(form.value.username, form.value.password)
      .subscribe(
        data => {
          loader.dismiss();
          if(data.response == 'fail') {
            const alert = this.alertCtrl.create({
              title: 'Login failed',
              message: data.actionMessages[0],
              buttons: ['Ok']
            });
            alert.present();
          } else {
            console.log('data here', data);
            this.userService.setUserWithResponseData(data);
            this.navCtrl.setRoot('WelcomePage');
          }
        },
        err => {
          loader.dismiss();
          console.log('This is an error', err);
        }
      );
    form.reset();
  }
}
