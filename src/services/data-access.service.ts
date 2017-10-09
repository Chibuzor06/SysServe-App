import { GlobalConstants } from './../global.constants';
import { UserService } from './user.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
/**
 * service for everything involving accessing (and sending) data
 * to (and from) the server.
 */
export class DataAccessService {
  private vehicleCategories: string[];
  // private vehicleGroups: { category: string, vehicles: string[] }[];
  constructor (private http: Http, private userSrvc: UserService) {}

  createNewReservation(serviceType: string, departure: string, destination: string, pickupDate: string, passengerName: string,
    noOfPassengers: number, noOfDays: number, returnTripPickUpDateTime: string, vehicleGroupID: number
  ) {
    const query: string = GlobalConstants.url + '/mobile/SubmitReservation.do?user.token=' + this.userSrvc.getUserToken() +
    '&reservationTrip.serviceType=' + serviceType + '&reservationTrip.departure=' + departure +
    '&reservationTrip.destination='+ destination +'&reservationTrip.pickUpDate=' + pickupDate +
    '&reservationTrip.passengerName=' + (passengerName ? passengerName: '') +
    '&reservationTrip.noOfPassenger=' + (noOfPassengers ? noOfPassengers: '') + '&reservationTrip.noOfDays=' + (noOfDays ? noOfDays : '') +
    '&returnReservationTrip.pickUpDate=' + (returnTripPickUpDateTime ? returnTripPickUpDateTime: '') +
    '&vehicleGroup.id=' + (vehicleGroupID ? vehicleGroupID: '');
    console.log(query);
    return this.http.get(query);
  }

  updateTrip(serviceType: string, departure: string, destination: string, pickupDate: string, passengerName: string,
    noOfPassengers: number, noOfDays: number, vehicleGroupID: number, id: number
  ) {
    const query: string = GlobalConstants.url + '/mobile/SubmitReservation.do?user.token=' + this.userSrvc.getUserToken() +
    '&reservationTrip.serviceType=' + serviceType + '&reservationTrip.departure=' + departure +
    '&reservationTrip.destination='+ destination +'&reservationTrip.pickUpDate=' + pickupDate +
    '&reservationTrip.passengerName=' + (passengerName ? passengerName: '') +
    '&reservationTrip.noOfPassenger=' + (noOfPassengers ? noOfPassengers: '') + '&reservationTrip.noOfDays=' + (noOfDays ? noOfDays : '') +
    '&vehicleGroup.id=' + (vehicleGroupID ? vehicleGroupID: '') + '&reservationTrip.id=' + id;
    console.log(query);
    return this.http.get(query);
  }

  cancelTrip(id: number[]) {
    let idString: string = ''; // comma seperated string of numbers
    id.forEach(
      num => {
        idString += num + ',';
      }
    )
    idString = idString.slice(0, idString.length-1);
    const query: string = GlobalConstants.url + '/mobile/CancelReservationTrip.do?' +
    'user.token=' + this.userSrvc.getUserToken() + '&reservationTripIds=' +  idString; //1,2,3,4,5'
    console.log(query);
    return this.http.get(query);
  }

  loadVehicleGroups(category: string) {
    const query = GlobalConstants.url + '/mobile/GetVehicleGroups.do?user.token='+ this.userSrvc.getUserToken() +
      '&vehicleGroupCategory=' + category;
    console.log(query);
    return this.http.get(query);
  }
  getVehicleCategories() {
    if(this.vehicleCategories) {
      return this.vehicleCategories.slice();
    } else {
      return null;
    }
  }
  loadVehicleCategories() {
    const query = GlobalConstants.url + '/mobile/GetVehicleCategory.do?user.token=' + this.userSrvc.getUserToken();
    return this.http.get(query);
  }

  loadVehicleImage(vehicleGroupID: number) {
    const query = GlobalConstants.url + '/mobile/GetVehicleGroupImage.do?user.token='+ this.userSrvc.getUserToken() +
      '&vehicleGroup.id=' + vehicleGroupID;
    console.log(query);
    return this.http.get(query);
  }

  rateTrip(id: string, rating: number, ratingRemark: string) {
    const query = GlobalConstants.url + '/mobile/SubmitRating.do?user.token='+ this.userSrvc.getUserToken() +
    '&taskTrip.id=' + id + '&taskTrip.rating=' + rating + '&taskTrip.ratingRemark=' + ratingRemark;
    console.log(query);
    return this.http.get(query);
  }
}
