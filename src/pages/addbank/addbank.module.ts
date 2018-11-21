import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddbankPage } from './addbank';
import {MultiPickerModule} from 'ion-multi-picker';
@NgModule({
  declarations: [
    AddbankPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(AddbankPage),
  ],
})
export class AddbankPageModule {}
