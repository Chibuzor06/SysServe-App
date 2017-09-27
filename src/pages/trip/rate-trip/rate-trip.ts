import { DataAcessService } from './../../../services/data-access.service';
import { NgForm } from '@angular/forms';
import { Trip } from './../../../models/trip.model';
import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, NavController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-rate-trip',
  templateUrl: './rate-trip.html'
})
export class RateTripPage {

  trip: Trip;
  rating: number = 0;
  starName: string[] = ['ios-star-outline', 'ios-star-outline', 'ios-star-outline', 'ios-star-outline', 'ios-star-outline'];
  rated: boolean = false;

  constructor(
    private navParams: NavParams, private dataSrvc: DataAcessService, private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    this.trip = this.navParams.get('trip')? this.navParams.get('trip'): {};
  }


  onStarClick(index: number) {
    // console.log('Star clicked');
    if (!this.rated) {
      this.rated = true;
    }
    this.rating = index + 1;
    if (this.starName[index] == 'ios-star' && index < this.starName.length) {
      for(let i = this.starName.length; i > index; i--) {
        this.starName[i] = 'ios-star-outline';
      }
      return;
    }
    if(index> 0) {
      for(let i = index; i >= 0; i--) {
        this.starName[i] = 'ios-star';
      }
    } else {
      this.starName[index] = 'ios-star';
    }
  }
  onRateTrip(form: NgForm) {
    console.log(form.value);
    if ( this.rating < 3 && (form.value.comments == '' || !form.value.comments)) {
      const alert = this.alertCtrl.create({
        message: 'Your rating is less than 3. Please tell us why...',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    console.log('Star: ', this.rating, ' comments: ', form.value.comments, ' Trip id: ', this.trip.taskTripId);
    this.dataSrvc.rateTrip(this.trip.taskTripId, this.rating, form.value.comments).subscribe(
      data => {
        const response = data.json();
        if (response.response == 'success') {
          const alert = this.alertCtrl.create({
            message: 'Your rating has been recorded successfully',
            buttons: ['Ok']
          });
          alert.present();
          alert.onDidDismiss(
            () => {
              this.navCtrl.pop();
            }
          );
        }
        else {
          const alert = this.alertCtrl.create({
            title: 'Unable to rater',
            message: 'An error occured while processing your rating. Please try again',
            buttons: ['Ok']
          });
          alert.present();
        }
      },
      err => {
        console.log(err);
        const alert = this.alertCtrl.create({
          title: 'Can\'t connect to the internet',
          message: 'There might be a problem with your network connection. Please check and try again',
          buttons: ['Ok']
        });
        alert.present();
      }
    );
    // this.dataSrvc.rateTrip();
  }
}
