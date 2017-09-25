import { UserService } from './user.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataAcessService {
  private vehicleCategories: string[];
  // private vehicleGroups: { category: string, vehicles: string[] }[];
  constructor (private http: Http, private userSrvc: UserService) {}

  createNewReservation(serviceType: string, departure: string, destination: string, pickupDate: string, passengerName: string,
    noOfPassengers: number, noOfDays: number, returnTripPickUpDateTime: string, vehicleGroupID: number
  ) {
    const query: string = '/sysserve/mobile/SubmitReservation.do?user.token=' + this.userSrvc.getUserToken() +
    '&reservationTrip.serviceType=' + serviceType + '&reservationTrip.departure=' + departure +
    '&reservationTrip.destination='+ destination +'&reservationTrip.pickUpDate=' + pickupDate +
    '&reservationTrip.passengerName=' + (passengerName ? passengerName: '') +
    '&reservationTrip.noOfPassenger=' + (noOfPassengers ? noOfPassengers: '') + '&reservationTrip.noOfDays=' + (noOfDays ? noOfDays : '') +
    '&returnReservationTrip.pickUpDate=' + (returnTripPickUpDateTime ? returnTripPickUpDateTime: '') +
    '&vehicleGroup.id=' + (vehicleGroupID ? vehicleGroupID: '');
    console.log(query);
    return this.http.get(query);
  }

  loadVehicleGroups(category: string) {
    const query = '/sysserve/mobile/GetVehicleGroups.do?user.token='+ this.userSrvc.getUserToken() +
      '&vehicleGroupCategory=' + category;
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
    const query = '/sysserve/mobile/GetVehicleCategory.do?user.token=' + this.userSrvc.getUserToken();
    return this.http.get(query);
  }

  loadVehicleImage(vehicleGroupID: number) {
    const query = '/sysserve/mobile/GetVehicleGroupImage.do?user.token='+ this.userSrvc.getUserToken() +
      '&vehicleGroup.id=' + vehicleGroupID;
    console.log(query);
    return this.http.get(query);
  }

  rateTrip(id: string, rating: number, ratingRemark: string) {
    const query = '/sysserve/mobile/SubmitRating.do?user.token='+ this.userSrvc.getUserToken() +
    '&taskTrip.id=' + id + '&taskTrip.rating=' + rating + '&taskTrip.ratingRemark=' + ratingRemark;

    return this.http.get(query);
  }
}
