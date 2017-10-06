import { GlobalConstants } from './../global.constants';
import { Response } from '@angular/http';
import { UserService } from './user.service';
import { Vehicle } from './../models/vehicle.model';
import { Driver } from './../models/driver.model';
import { Injectable } from '@angular/core';
import { Trip } from './../models/trip.model';
import { Http } from '@angular/http';
import 'rxjs/Rx'

@Injectable()
export class TripsService {

  trips: Trip[];
  constructor(private http: Http, private userSrvc: UserService ) {}
  loadTrips(){
    const query: string = GlobalConstants.url + '/mobile/GetTrips.do?user.token=' + this.userSrvc.getUserToken();
    // console.log(query);
    return this.http.get(query)
      .map(
        (response: Response) => {
          // const trips = response.json()? response.json() : [];
          const trips = response.json();
          // console.log('loadTrips method', trips);
          if(trips.response == 'fail') {
            return trips;
          }
          const formattedTrips = trips.map(
            trip => {
              // console.log(trip);
              return new Trip(trip.departure, trip.destination, <string>trip.pickUpDate,
              (trip.noOfDays? trip.noOfDays : 1), trip.noOfPassenger, trip.passengerName, trip.status,
              (trip.personnel ? new Driver(trip.personnel.fullName, trip.personnel.phone) : null),
              (trip.vehicle ? new Vehicle(trip.vehicle.plateNumber, trip.vehicle.make + ' ' + trip.vehicle.model, trip.vehicle.color) : null),
              trip.id, trip.expectedEndDate, (trip.taskTripId ? trip.taskTripId : null), trip.serviceType);
            }
          );
          // console.log(formattedTrips);
          return formattedTrips;
        }
      )
      .do(
        (trips) => {
          if (trips.response == 'fail') {
            this.trips == [];
          } else {
            this.trips = trips;
          }

        }
      );
  }

  getTrips() {
    if (!this.trips) return null;

    return this.trips.slice();
  }

  // method called on logout
  clearTrips() {
    this.trips = null;
  }
}
