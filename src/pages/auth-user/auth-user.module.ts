import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthUserPage } from './auth-user';

@NgModule({
  declarations: [
    AuthUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthUserPage),
  ],
})
export class AuthUserPageModule {}
