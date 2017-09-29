import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { DailyRentalPage } from './daily-rental';
@NgModule({
  declarations:[ DailyRentalPage],
  imports:[
    IonicPageModule.forChild(DailyRentalPage)
  ]
})
export class DailyRentalPageModule{}
