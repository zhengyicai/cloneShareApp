import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuardListPage } from './guard-list';

@NgModule({
  declarations: [
    GuardListPage,
  ],
  imports: [
    IonicPageModule.forChild(GuardListPage),
  ],
})
export class GuardListPageModule {}
