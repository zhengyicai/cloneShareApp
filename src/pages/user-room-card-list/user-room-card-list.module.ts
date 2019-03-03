import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRoomCardListPage } from './user-room-card-list';

@NgModule({
  declarations: [
    UserRoomCardListPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRoomCardListPage),
  ],
})
export class UserRoomCardListPageModule {}
