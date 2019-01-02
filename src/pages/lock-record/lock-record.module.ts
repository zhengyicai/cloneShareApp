import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LockRecordPage } from './lock-record';

@NgModule({
  declarations: [
    LockRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(LockRecordPage),
  ],
})
export class LockRecordPageModule {}
