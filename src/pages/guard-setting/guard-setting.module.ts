import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuardSettingPage } from './guard-setting';

@NgModule({
  declarations: [
    GuardSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(GuardSettingPage),
  ],
})
export class GuardSettingPageModule {}
