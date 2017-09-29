import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { PickDropPage } from './pick-drop';
@NgModule({
  declarations: [
    PickDropPage
  ],
  imports: [
    IonicPageModule.forChild(PickDropPage)
  ]

})
export class PickDropPageModule {}
