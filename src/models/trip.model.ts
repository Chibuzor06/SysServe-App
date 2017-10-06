import { Vehicle } from './vehicle.model';
import { Driver } from './driver.model';


export class Trip {
  displayPickupDate: string;
  displayEndDate: string;
  selected: boolean; //for marking in trips.html
  class: string; //for one-way binding to class in trips.html;
  constructor(public departure: string, public destination: string, public pickupDate: string,
    public noOfDays: number, public noOfpassengers: number, public passengerName: string, public status: string, public driver: Driver,
    public vehicle: Vehicle, public ID: number, public expectedEndDate: string, public taskTripId: string,
    public serviceType: string
  ) {
    this.class = '';
    this.displayPickupDate = new Date(pickupDate)
      .toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true, month: '2-digit', year: 'numeric', day: '2-digit'}).replace(",","");
    this.displayEndDate = (expectedEndDate && expectedEndDate != '') ? new Date(expectedEndDate)
      .toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true, month: '2-digit', year: 'numeric', day: '2-digit'}).replace(",","") : '';
  }
}
