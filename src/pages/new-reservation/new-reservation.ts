import { DataAcessService } from './../../services/data-access.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { googlemaps } from 'googlemaps'
// declare var google: any;

@IonicPage()
@Component({
  selector: 'page-new-reservation',
  templateUrl: 'new-reservation.html',
})
export class NewReservationPage implements OnInit{
  vehicles: { id: number, make: string, model: string }[];
  vehicleCategories: string[];
  segment: string = 'trip';
  type: string = 'Pick Up/Drop Off';
  departure: string = '';
  destination: string = '';
  dateTime: string = '';
  returnTrip: boolean;
  returnDateTime: string = '';
  passengers: number;
  passengerName: string = '';
  noOfDays: number;
  vehicleGroupID: number;
  vehicleClass: string = '';
  tripFormValid: boolean = false;
  imageData: string = '';
  safeImageUrl: SafeUrl = '';

  // @ViewChild('departure', {read: ElementRef}) departurePredict: ElementRef;

  input1: HTMLInputElement; //departure input
  input2: HTMLInputElement; //destination input

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dataAccessSrvc: DataAcessService, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private domSanitizer: DomSanitizer
  ) {

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


  predictOptions = {
    // types: ['(cities)'],
    componentRestrictions: {country: 'ng'}
  };


  ionViewDidLoad() {
    // initializing auto-complete
    // apparently doesn't work on ios

    this.input1 = <HTMLInputElement>(document.getElementsByClassName('text-input')[0]);
    console.log(this.input1);
    const autocomplete1 = new google.maps.places.Autocomplete(this.input1, this.predictOptions);

    this.input2 = <HTMLInputElement>(document.getElementsByClassName('text-input')[1]);
    console.log(this.input2);
    const autocomplete2 = new google.maps.places.Autocomplete(this.input2, this.predictOptions);

    //fix for ios
    autocomplete2.addListener("place_changed", () => {
      let place1: google.maps.places.PlaceResult = autocomplete1.getPlace();
      this.departure = place1.formatted_address;
      // console.log(this.departure);
    });
    autocomplete2.addListener("place_changed", () => {
      let place2: google.maps.places.PlaceResult = autocomplete2.getPlace();
      this.destination = place2.formatted_address;
      // console.log(this.destination);
    });

    //alternative approach, but cannot use two-way binding with this approach
    // const input1 = this.departurePredict.nativeElement.querySelector('.text-input');
    // console.log(input1);
    // const autocomplete1 = new google.maps.places.Autocomplete(input1, this.predictOptions);
  }

  onSegmentChange(valid: boolean, event) {
    // console.log('Form Valid', valid, event);
    if (event.value == 'vehicle') {
      this.tripFormValid = valid;
      this.destination = this.input2.value;
      this.departure = this.input1.value;
    }

  }

  onNewReservation(form: NgForm) {
    if (!this.tripFormValid && this.segment == 'vehicle') {
      const alert = this.alertCtrl.create({
        message: 'Please complete relevant form fields!',
        buttons: ['Ok']
      });
      alert.present();
      alert.onDidDismiss(
        () => {
          this.segment = 'trip';
        }
      );
      return;
    }

    const loader = this.loadingCtrl.create({
      content: 'Submitting Reservation...',
      dismissOnPageChange: true,
      enableBackdropDismiss: false
    });
    loader.present();

    // console.log('Previous ', this.dateTime);
    // formatting time to a format the server can understand (remove the 'Z' at the end).
    this.dateTime = this.dateTime.slice(0, 19);
    // console.log('New ', this.dateTime);
    this.returnDateTime = this.returnDateTime.slice(0, 19);

    const reservation = this.dataAccessSrvc.createNewReservation(this.type, this.departure, this.destination, this.dateTime, this.passengerName,
      (this.type =='Pick Up/Drop Off' ? this.passengers : null),
      (this.type == 'Daily Rental' ? this.noOfDays : null),
      (this.type == 'Pick Up/Drop Off' && this.returnTrip ? this.returnDateTime : ''), this.vehicleGroupID);

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
          this.clearForm();
          this.navCtrl.pop();
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

  // manualValidityCheck() {
  //   let invalid = false;
  //   if (this.departure == '' || !this.departure || this.destination == '' || !this.departure ||
  //       this.dateTime == '' || !this.dateTime) {
  //       invalid = true;
  //     }
  //   if ((this.type == 'Pick Up/Drop Off') && (this.passengers == NaN || !this.passengers ||
  //       (this.returnTrip && (this.returnDateTime == '' || !this.returnDateTime) ))) {
  //       invalid = true;
  //       console.log('Inside pickup');
  //     }
  //   if ((this.type == 'Daily Rental') && (this.noOfDays == NaN || !this.noOfDays)) {
  //     invalid = true;
  //     console.log('Inside rental');
  //   }
  //   return invalid;
  // }

  clearForm() {
    // this.vehicle = null;
    this.type = 'Pick Up/Drop Off';
    this.departure = null;
    this.destination = null;
    this.dateTime = null;
    this.returnTrip = null;
    this.returnDateTime = null;
    this.passengers = null;
    this.passengerName = null;
    this.noOfDays = null;
    // this.vehicleClass = null;
  }

  onVehicleClassChosen(value: string) {
    if (value == '' || !value) {
      return;
    }
    const loader = this.loadingCtrl.create({
      content: 'Loading ' + this.vehicleClass + ' category',
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    });
    loader.present();
    this.dataAccessSrvc.loadVehicleGroups(value).subscribe(
      data => {
        this.vehicles = data.json();
        this.vehicleGroupID = 0;
        console.log(this.vehicles);
        loader.dismiss();

      },
      err => {
        loader.dismiss();
        console.log(err);
      }
    );
  }

  onVehicleChosen(id: number) {
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
        if( data.json() == {} || !data.json()) {
          loader.dismiss();
          return;
        } else {
          loader.dismiss();
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
