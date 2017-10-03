import { Trip } from './../../../models/trip.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the TripPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html',
})
export class TripPage {

  trip: Trip;
  canRate: Boolean = false;
  canEdit: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.trip = this.navParams.get('trip');
    if (this.trip.taskTripId && this.trip.taskTripId != null) {
      this.canRate = true;
    }
    if (this.trip.status == 'Submitted') {
      this.canEdit = true;
    }
    // console.log(this.trip);
  }

  ionViewWillLoad() {
    if(!this.trip) {
      // console.log('HEre', this.navCtrl.canGoBack());
      this.navCtrl.setRoot('HomePage');
    }
  }
  onCancelTrip() {
    const alert = this.alertCtrl.create({
      title: 'Warning!',
      message: 'You are about to cancel this trip. Continue?',
      buttons: [ 
        {
          text: 'Yes',
          handler: () => {
            
          }
        },
        {
          text: 'No',
          handler: () => {

          },
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
  
  onUpdateTrip() {
    const alert = this.alertCtrl.create({
      title: 'Update Trip',
      message: 'You are about to update this trip details. Continue?',
      buttons: [ 
        {
          text: 'Yes',
          handler: () => {
            if(this.trip.serviceType == 'Daily Rental') {
              this.navCtrl.push('DailyRentalPage', {
                mode: 'edit', trip : this.trip });
            }else {
              this.navCtrl.push('PickDropPage', {
                mode: 'edit', trip : this.trip})
            }
          }
        },
        {
          text: 'No',
          handler: () => {

          },
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  onRateTrip() {
    // console.log('RateTripPage');
    this.navCtrl.push('RateTripPage', {
      trip: this.trip
    });
  }



}
