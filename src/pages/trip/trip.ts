import { Trip } from './../../models/trip.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get('trip');
    if (this.trip.taskTripId && this.trip.taskTripId != null) {
      this.canRate = true;
    }
    // console.log(this.trip);
  }

  ionViewWillLoad() {
    if(!this.trip) {
      // console.log('HEre', this.navCtrl.canGoBack());
      this.navCtrl.setRoot('WelcomePage');
    }
  }

  onRateTrip() {
    // console.log('RateTripPage');
    this.navCtrl.push('RateTripPage', {
      trip: this.trip
    });
  }



}
