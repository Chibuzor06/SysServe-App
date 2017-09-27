import { DataAcessService } from './../../services/data-access.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dataAccessSrvc: DataAcessService, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private domSanitizer: DomSanitizer
  ) {
  }
  ngOnInit() {
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

  onSegmentChange(valid: boolean, event) {
    // console.log('Form Valid', valid, event);
    if (event.value == 'vehicle') {
      this.tripFormValid = valid;
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
