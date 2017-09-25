import { Vehicle } from './vehicle.model';
import { Driver } from './driver.model';


export class Trip {
  constructor(public departure: string, public destination: string, public pickupDate: string,
    public noOfDays: number, public noOfpassengers: number, public status: string, public driver: Driver,
    public vehicle: Vehicle, public ID: string, expectedEndDate: string
  ) {}
}
