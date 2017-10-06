// import { User } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { Trip } from './../../models/trip.model';
import { TripsService } from './../../services/trips.service';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';

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
  trips: Trip[] = []; // trips from trips service
  actionMessage: string;
  loadedTrips: boolean;
  markMode: boolean;
  selectedTripIDs: {index: number, tripID : number}[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private tripService: TripsService,
    private events: Events, private alertCtrl: AlertController
  ) {
    this.selectedTripIDs = [];
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
      this.loadedTrips = true;
      this.actionMessage = "";
      this.trips = this.tripService.getTrips();
      this.loadTrips();
    }

  }

  trackByFn(index, trip) {
    // console.log('TractBy fn');
    return trip.ID;
  }

  onTripSelected(index: number) {
    // console.log(index);
    console.log('viewTrip');
    this.navCtrl.push('TripPage', {
      trip: this.trips[index]
    });
  }

  onPress(index) {
    console.log('pressed');
    if (!this.markMode) {
      this.markMode = true;
    }
    const valid = this.selectTrip(index);
    if(!valid && this.selectedTripIDs.length == 0) {
      this.markMode = false;
      return; // trip status is not valid
    }
    // else {
    //   this.markMode = true;
    // }
    // if (!this.trips[index].selected) {
    //   this.trips[index].selected = true;
    // }

  }
  // selectTrip(index: number) {
  //   // console.log('selectTrip');
  //   // console.log('mark mode', this.markMode);
  //   const trip = this.trips[index];
  //   if (trip.selected) {
  //     trip.selected = false;
  //     const position = this.selectedTripIDs.indexOf({index: index, tripID: trip.ID });
  //     this.selectedTripIDs.splice(position, 1);
  //     console.log(this.selectedTripIDs);
  //     if (this.selectedTripIDs.length == 0) {
  //       this.markMode = false;
  //     }
  //   } else  {
  //     if (trip.status != 'Submitted') {
  //       const alert = this.alertCtrl.create({
  //         title: 'Notice!',
  //         message: 'Only trips with status \'Submitted\' can be cancelled',
  //         buttons: ['Ok']
  //       });
  //       alert.present();
  //       console.log('After alert, selected trips: ', this.selectedTripIDs, ' mark mode: ', this.markMode);
  //       return false;
  //     }
  //     trip.selected = true;
  //     const position = this.selectedTripIDs.indexOf({ index: index, tripID: trip.ID });
  //     if (position < 0) {
  //       this.selectedTripIDs.push({ index: index, tripID: trip.ID });
  //       console.log(this.selectedTripIDs);
  //     }
  //     return true;
  //   }
  // }

  selectTrip(index: number) {
    const trip = this.trips[index];
    if (trip.status != 'Submitted') {
      const alert = this.alertCtrl.create({
        title: 'Notice!',
        message: 'Only trips with status \'Submitted\' can be cancelled',
        buttons: ['Ok']
      });
      alert.present();
      console.log(this.selectedTripIDs);
      console.log('trip.selected: ', trip.selected);
      return false;
    }
    else {
      if (trip.selected) {
        const position = this.selectedTripIDs.indexOf({index: index, tripID: trip.ID });
        this.selectedTripIDs.splice(position, 1);
        trip.selected = false;
        trip.class = '';
        if (this.selectedTripIDs.length == 0) {
          this.markMode = false;
        }
      } else {
        this.selectedTripIDs.push({ index: index, tripID: trip.ID });
        trip.selected = true;
        trip.class = 'selected';
      }
      console.log(this.selectedTripIDs);
      console.log('trip.selected: ', trip.selected);
      return true;
    }
  }

  onNoMoreMarking() {
    this.selectedTripIDs.forEach(
      ID => {
        this.trips[ID.index].selected = false; //index in original trip array
        this.trips[ID.index].class = '';
      }
    );
    this.selectedTripIDs = [];
    console.log('selectedTrips', this.selectedTripIDs);
    this.markMode = false;
  }

  onCancelTrips() {
    const alert = this.alertCtrl.create({
      title: 'Warning!',
      message: 'You are about to cancel ' + this.selectedTripIDs.length +' trip(s). Are you sure?',
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

  private loadTrips() {
  this.tripService.loadTrips().subscribe(trips => {
    if(trips.response == 'fail') {
      this.actionMessage = trips.actionMessages[0];
      this.loadedTrips = true;
    }
    else {
      this.trips = trips;
      this.loadedTrips = true;
    }});
  }
  ngOnDestroy() {
    this.events.unsubscribe('reservation-created');
  }
}
