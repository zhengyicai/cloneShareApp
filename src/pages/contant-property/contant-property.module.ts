import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContantPropertyPage } from './contant-property';

@NgModule({
  declarations: [
    ContantPropertyPage,
  ],
  imports: [
    IonicPageModule.forChild(ContantPropertyPage),
  ],
})
export class ContantPropertyPageModule {}
