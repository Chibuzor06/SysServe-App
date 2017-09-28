import { User } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { SegmentService } from './../../services/segment.service';
import { Trip } from './../../models/trip.model';
import { TripsService } from './../../services/trips.service';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage implements OnDestroy{

  segment: string;
  trips: Trip[]; // trips from trips service
  actionMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private tripService: TripsService, private segmentSrvc: SegmentService,
    private userSrvc: UserService, private toastCtrl: ToastController, private events: Events
  ) {
    //if new reservation created, then reload trips
    events.subscribe('reservation-created',
      () => {
        this.loadTrips();
      }
    );

  }

  ionViewWillLoad() {
    // // console.log('Will Enter', this.tripService.getTrips());
    if (!this.tripService.getTrips()) {
      // console.log('HEre');
        this.loadTrips();
    } else {
      this.trips = this.tripService.getTrips();
    }
    this.segment = this.segmentSrvc.getCurrentSegment();
  }

  ionViewDidEnter() {
    if (!this.userSrvc.toastShown){
      if(this.userSrvc.getUser()) {
        const user: User = this.userSrvc.getUser();
        // // console.log(user, 'This is the user');
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
  onSegmentChange(event: any) {
    // // console.log(this.segment, event);
    this.segmentSrvc.setCurrentSegment(this.segment);
  }

  onLoadTrips() {
    this.tripService.loadTrips().subscribe(
      data => {
        // console.log(data);
      },
      err => {
        // console.log('This is an error', err.json());
      }
    );
  }

  onTripSelected(index: number) {
    // // console.log(index);
    this.navCtrl.push('TripPage', {
      trip: this.tripService.getTrips()[index]
    });
  }

  setSegment(event) {
    // this.segmentSrvc.setCurrentSegment(segment);
    // this.segment = segment;
    if (event.deltaX > 0) {
      if (this.segment != 'trips') {
        this.segmentSrvc.setCurrentSegment('trips');
        this.segment = 'trips';
      }
      return;
    }
    if (event.deltaX < 0) {
      if (this.segment != 'messages') {
        this.segmentSrvc.setCurrentSegment('messages');
        this.segment = 'messages';
      }
      return;
    }
    // // console.log(event);
  }

  private loadTrips() {
  this.tripService.loadTrips().subscribe(trips => {
    if(trips.response == 'fail') {
    }
    else {
          this.trips = trips;
    }});
  }
  ngOnDestroy() {
    this.events.unsubscribe('reservation-created');
  }
}
