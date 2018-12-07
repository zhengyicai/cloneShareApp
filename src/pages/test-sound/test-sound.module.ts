import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestSoundPage } from './test-sound';

@NgModule({
  declarations: [
    TestSoundPage,
  ],
  imports: [
    IonicPageModule.forChild(TestSoundPage),
  ],
})
export class TestSoundPageModule {}
