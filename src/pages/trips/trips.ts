// import { User } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { SegmentService } from './../../services/segment.service';
import { Trip } from './../../models/trip.model';
import { TripsService } from './../../services/trips.service';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trips',
  templateUrl: 'trips.html',
})
export class TripsPage implements OnDestroy{

  segment: string;
  trips: Trip[]; // trips from trips service
  actionMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private tripService: TripsService, private segmentSrvc: SegmentService,
    private events: Events
  ) {
    //if new reservation created, then reload trips
    events.subscribe('reservation-created',
      () => {
        console.log('Reservation Created')
        this.loadTrips();
      }
    );

  }

  ionViewWillLoad() {
    // console.log('Will Enter', this.tripService.getTrips());
    if (!this.tripService.getTrips()) {
      // console.log('HEre');
        this.loadTrips();
    } else {
      this.trips = this.tripService.getTrips();
      this.loadTrips();
    }
    
  }

  // onLoadTrips() {
  //   this.tripService.loadTrips().subscribe(
  //     data => {
  //       console.log(data);
  //     },
  //     err => {
  //       console.log('This is an error', err.json());
  //     }
  //   );
  // }

  onTripSelected(index: number) {
    // console.log(index);
    this.navCtrl.push('TripPage', {
      trip: this.tripService.getTrips()[index]
    });
  }

  private loadTrips() {
  this.tripService.loadTrips().subscribe(trips => {
    if(trips.response == 'fail') {
      this.actionMessage = trips.actionMessages[0];
    }
    else {
          this.trips = trips;
    }});
  }
  ngOnDestroy() {
    this.events.unsubscribe('reservation-created');
  }
}
