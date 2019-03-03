import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoomCardListPage } from './room-card-list';

@NgModule({
  declarations: [
    RoomCardListPage,
  ],
  imports: [
    IonicPageModule.forChild(RoomCardListPage),
  ],
})
export class RoomCardListPageModule {}
