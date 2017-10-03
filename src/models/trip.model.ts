import { Vehicle } from './vehicle.model';
import { Driver } from './driver.model';


export class Trip {

  constructor(public departure: string, public destination: string, public pickupDate: string,
    public noOfDays: number, public noOfpassengers: number, public status: string, public driver: Driver,
    public vehicle: Vehicle, public ID: string, public expectedEndDate: string, public taskTripId: string, 
    public serviceType: string
  ) {
    this.pickupDate = new Date(pickupDate)
      .toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true, month: '2-digit', year: 'numeric', day: '2-digit'}).replace(",","");
    this.expectedEndDate = (expectedEndDate && expectedEndDate != '') ? new Date(expectedEndDate)
      .toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true, month: '2-digit'}).replace(",","") : '';
  }
}
