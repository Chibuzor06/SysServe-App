import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataAcessService } from './../../../services/data-access.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, NavController, Events, NavParams } from 'ionic-angular';
import { googlemaps } from 'googlemaps';

@IonicPage()
@Component({
  selector: 'page-daily-rental',
  templateUrl: './daily-rental.html'
})
export class DailyRentalPage{

  mode: string //either edit or new

  input1: HTMLInputElement; //departure input
  input2: HTMLInputElement; //destination input
  imageData: string;
  safeImageUrl: SafeUrl;
  vehicle: boolean;
  vehicleCategories: string[];
  vehicleClass: string;
  vehicles: { id: number, make: string, model: string }[];
  vehicleGroupID: number;
  departure: string;
  destination: string;


  constructor( private dataAccessSrvc: DataAcessService, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private navCtrl: NavController, private events: Events,
    private domSanitizer: DomSanitizer, private navParams: NavParams
  ) {
    this.mode = navParams.get('mode');
    if (this.mode == 'edit') {
      
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
        // this.input1.value = place1.formatted_address;
        // this.departure = this.input1.value;
        // console.log('input 1', this.input1.value)
      }
      // console.log(this.departure);
    });
    autocomplete2.addListener("place_changed", () => {
      let place2: google.maps.places.PlaceResult = autocomplete2.getPlace();
      if (place2) {
        // this.input2.value = place2.formatted_address;
        // console.log(this.input2.value);
        // this.destination = this.input2.value;
      }
      // console.log(this.destination);
    });
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
    // const returnDateTime = form.value.returnDateTime.slice(0, 19);

    const reservation = this.dataAccessSrvc.createNewReservation('Daily Rental', form.value.departure, form.value.destination, dateTime,
      form.value.passengerName,
      form.value.passengers, form.value.noOfDays,
      '', (form.value.vehicleGroupID ? form.value.vehicleGroupID : ''));
    // loader.dismiss();
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
        this.vehicles = data.json(); //array of vehicles in selected category
        this.vehicleGroupID = 0;
        // console.log(this.vehicles);
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
