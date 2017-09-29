import { Vehicle } from './vehicle.model';
import { Driver } from './driver.model';


export class Trip {

  constructor(public departure: string, public destination: string, public pickupDate: string,
    public noOfDays: number, public noOfpassengers: number, public status: string, public driver: Driver,
    public vehicle: Vehicle, public ID: string, public expectedEndDate: string, public taskTripId: string
  ) {
    // let a = new Date(pickupDate);
    // let day = a.getDate();
    // let month = a.getMonth() + 1;
    // let year = a.getFullYear();
    // let hour = a.getHours();
    // let minutes = a.getMinutes() < 10 ? '0' + a.getMinutes() :  a.getMinutes();
    // let moment;
    // let newHour;
    // if (hour > 12) {
    //   hour = hour - 12;
    //   moment = 'PM'
    // } else {
    //   moment = 'AM'
    // }
    // this.pickupDate = day + '-' + month + '-' + year + ' ' + hour + ':' + minutes + ' ' + moment;
    this.pickupDate = new Date(pickupDate).toLocaleDateString('en-NG', {hour: '2-digit', minute: '2-digit', hour12: true}).replace(",","");
    this.expectedEndDate = expectedEndDate ? new Date(expectedEndDate).toLocaleDateString('en-NG', {hour: '2-digit', minute: '2-digit', hour12: true}).replace(",","") : '';
  }
}
