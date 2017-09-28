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
  // trips: Trip[] = [
  //   new Trip('Tomorrow', 'Abuja', new Date().toDateString(), 3, 4, 'Submitted', new Driver('Abiodun', 28132121234),
  //     new Vehicle('AAA-2109V', 'Nissan Explorer','brown'), '316', new Date().toLocaleDateString()),
  //   new Trip('Next Week', 'Ibadan', new Date().toDateString(), 3, 4, 'Confirmed', new Driver('Ibile', 2121212),
  //     new Vehicle('DCA-1093G', 'Honda Disaster','green'), '202', new Date().toLocaleDateString())
  // ];
  constructor(private http: Http, private userSrvc: UserService ) {}
  loadTrips(){
    const query: string ='http://fleetmanager.sixtnigeria.com/mobile/GetTrips.do?user.token=' + this.userSrvc.getUserToken();
    console.log(query);
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
              return new Trip(trip.departure, trip.destination, (<string>trip.pickUpDate).slice(0, 10),
              (trip.noOfDays? trip.noOfDays : 1), trip.noOfPassenger, trip.status,
              (trip.personnel ? new Driver(trip.personnel.fullName, trip.personnel.phone) : null),
              (trip.vehicle ? new Vehicle(trip.vehicle.plateNumber, trip.vehicle.make + ' ' + trip.vehicle.model, trip.vehicle.color) : null),
              trip.id, new Date(trip.expectedEndDate + 'Z').toDateString(), (trip.taskTripId ? trip.taskTripId : null));
            }
          );
          // console.log(formattedTrips);
          return formattedTrips;
        }
      )
      .do(
        (trips) => {
          if (trips.response) {
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
