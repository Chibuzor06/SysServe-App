import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RateTripPage } from './rate-trip';

@NgModule({
  declarations: [
    RateTripPage
  ],
  imports: [
    IonicPageModule.forChild(RateTripPage)
  ]
})
export class RateTripPageModule {}
