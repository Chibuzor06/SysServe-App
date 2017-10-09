import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataAccessService } from './../../../services/data-access.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController, AlertController, NavController, Events, NavParams } from 'ionic-angular';

import { googlemaps } from 'googlemaps';
import { Trip } from '../../../models/trip.model';

@IonicPage()
@Component({
  selector: 'page-pick-drop',
  templateUrl: './pick-drop.html'
})
export class PickDropPage implements OnInit{
  vehicleChosen: boolean; //used to start the image loading spinner
  mode: string //either edit or new
  tripEdit: Trip;

  input1: HTMLInputElement; //departure input
  input2: HTMLInputElement; //destination input
  imageData: string;
  safeImageUrl: SafeUrl;
  vehicle: boolean;
  vehicleCategories: string[];
  vehicleClass: string;
  vehicles: { id: number, make: string, model: string }[];
  vehicleGroupID: number;
  noImageText: string;

  constructor( private dataAccessSrvc: DataAccessService, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private navCtrl: NavController, private events: Events,
    private domSanitizer: DomSanitizer, private navParams: NavParams
  ) {
    this.mode = navParams.get('mode');
    if (this.mode == 'edit') {
      this.tripEdit = navParams.get('trip');
      console.log(this.tripEdit);
      // this.dateTime = new Date(this.tripEdit.pickupDate).toISOString();
    }
  }

  ngOnInit() {
    //Getting vehicle categories from server on page init.
    if (this.dataAccessSrvc.getVehicleCategories()) {
      this.vehicleCategories = this.dataAccessSrvc.getVehicleCategories();
    } else {
      this.dataAccessSrvc.loadVehicleCategories().subscribe(
        response => {
          console.log(response.json(), 'Response here');
          this.vehicleCategories = response.json().vehicleCategoryList;
        },
        err => {
          console.log('Error here', err);
          this.vehicleCategories = [''];
        }
      );
    }
  }

  ionViewDidLoad() {
    // initializing auto-complete
    // apparently doesn't work on ios
    const predictOptions = {
      // types: ['(cities)'],
      componentRestrictions: {country: 'ng'}
    };

    this.input1 = <HTMLInputElement>(document.getElementsByClassName('text-input')[0]);
    // console.log(this.input1);
    const autocomplete1 = new google.maps.places.Autocomplete(this.input1, predictOptions);

    this.input2 = <HTMLInputElement>(document.getElementsByClassName('text-input')[1]);
    // console.log(this.input2);
    const autocomplete2 = new google.maps.places.Autocomplete(this.input2, predictOptions);

    autocomplete1.addListener("place_changed", () => {
      let place1: google.maps.places.PlaceResult = autocomplete1.getPlace();
      if (place1) {
        console.log('input 1', this.input1.value);
        // console.log(place1);
        // // console.log(place1);
        // this.input1.value = place1.formatted_address;
        // console.log('input 1 again', this.input1.value)
      }
      // console.log(this.departure);
    });
    autocomplete2.addListener("place_changed", () => {
      let place2: google.maps.places.PlaceResult = autocomplete2.getPlace();
      if (place2) {
        // this.input2.value = place2.formatted_address;
      }
      // console.log(this.destination);
    });
    if (this.mode == 'edit') {
      this.input1.value = this.tripEdit.departure;
      this.input2.value = this.tripEdit.destination;
    }
  }
  onNewReservation(form: NgForm) {
    console.log(form.value);

    const loader = this.loadingCtrl.create({
      content: 'Submitting Reservation...',
      dismissOnPageChange: true,
      enableBackdropDismiss: false
    });
    loader.present();

    console.log('Previous ', form.value.dateTime);
    // formatting time to a format the server can understand (remove the 'Z' at the end).
    const dateTime = form.value.dateTime.slice(0, 19);
    // console.log('New ', dateTime);
    const returnDateTime = form.value.returnTrip? form.value.returnDateTime.slice(0, 19) : '';

    // const reservation = this.dataAccessSrvc.createNewReservation('Pick Up/Drop Off', form.value.departure, form.value.destination, dateTime,
    //   form.value.passengerName,
    //   form.value.passengers, null,
    //   returnDateTime, (form.value.vehicleGroupID ? form.value.vehicleGroupID : ''));
    //   // loader.dismiss();
    let reservation;
    if(this.mode == 'new') {
      reservation = this.dataAccessSrvc.createNewReservation('Pick Up/Drop Off', form.value.departure, form.value.destination, dateTime,
      form.value.passengerName,
      form.value.passengers, null,
      returnDateTime, (form.value.vehicleGroupID ? form.value.vehicleGroupID : ''));
    }else {
      reservation = this.dataAccessSrvc.updateTrip('Pick Up/Drop Off', form.value.departure, form.value.destination, dateTime,
      form.value.passengerName,
      form.value.passengers, null,
      (form.value.vehicleGroupID ? form.value.vehicleGroupID : ''), this.tripEdit.ID);
    }

    reservation.subscribe(
      data => {
        const obj = data.json();
        let alertMessage: string;
        console.log(obj);
        if (obj.response == 'fail') {
          alertMessage = obj.actionMessages[0];
          const alert = this.alertCtrl.create({
            message: alertMessage,
            buttons: ['Ok']
          });
          loader.dismiss().then(
            () => {
              alert.present();
            }
          );
        } else {
          alertMessage = 'New reservation created.';
          const alert = this.alertCtrl.create({
            message: alertMessage,
            buttons: ['Ok']
          });
          loader.dismiss().then(
            () => {
              alert.present();
            }
          );
          this.events.publish('reservation-created');
          // this.clearForm();
          this.navCtrl.popToRoot();
        }

      },
      err => {
        loader.dismiss();
        console.log('Error, ', err);
        const alert = this.alertCtrl.create({
          title: 'Can\'t connect to the internet',
          message: 'There might be a problem with your network connection. Please check and try again',
          buttons: ['Ok']
        });
        alert.present();
      }
    );
  }

  onVehicleClassChosen(value: string) {
    console.log('heretic');
    if (value == '' || !value) {
      return;
    }
    if (!(value == this.vehicleClass)) {
      console.log('heresy');
      // this.vehicles = null;
      this.noImageText = null;
      this.vehicleChosen = false;
    }
    const loader = this.loadingCtrl.create({
      content: 'Loading ' + value + ' category',
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    });
    loader.present();
    this.dataAccessSrvc.loadVehicleGroups(value).subscribe(
      data => {
        this.vehicles = data.json(); //array of vehicles in selected category
        this.vehicleGroupID = 0;
        // console.log(this.vehicles);
        loader.dismiss();
        this.vehicleClass = value;
      },
      err => {
        loader.dismiss();
        console.log(err);
      }
    );
    console.log('Vehicle Class', this.vehicleClass)
  }

  onVehicleChosen(id: number) {
    this.vehicleChosen = true;
    const loader = this.loadingCtrl.create({
      content: 'Loading vehicle image',
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    });
    loader.present();
    this.imageData = 'data:image/png;base64, ';
    // console.log(id);
    this.dataAccessSrvc.loadVehicleImage(id).subscribe(
      data => {
        if( data.json().encodedContent == null) {
          loader.dismiss();
          this.noImageText = "Image currently Unavailable";
          // console.log('ere');
          return;
        } else {
          loader.dismiss();
          // console.log('eret', data);
          this.imageData += data.json().encodedContent;
          // console.log(this.imageData);
          this.safeImageUrl = this.domSanitizer.bypassSecurityTrustUrl(this.imageData);
        }
      },
      err => {
        loader.dismiss();
        console.log('Image Error', err);
      }

    );
  }
}
