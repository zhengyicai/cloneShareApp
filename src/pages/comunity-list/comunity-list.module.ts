import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComunityListPage } from './comunity-list';

@NgModule({
  declarations: [
    ComunityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ComunityListPage),
  ],
})
export class ComunityListPageModule {}
