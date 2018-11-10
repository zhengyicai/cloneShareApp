import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateNamePage } from './update-name';

@NgModule({
  declarations: [
    UpdateNamePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateNamePage),
  ],
})
export class UpdateNamePageModule {}
