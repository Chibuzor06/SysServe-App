import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { googlemaps } from 'googlemaps'
// declare var google: any;

@IonicPage()
@Component({
  selector: 'page-new-reservation',
  templateUrl: 'new-reservation.html',
})
export class NewReservationPage {
  constructor(public navCtrl: NavController) {
  }

  loadPage(page: any) {
    this.navCtrl.push(page);
  }

}
