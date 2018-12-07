import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoundDecodePage } from './sound-decode';

@NgModule({
  declarations: [
    SoundDecodePage,
  ],
  imports: [
    IonicPageModule.forChild(SoundDecodePage),
  ],
})
export class SoundDecodePageModule {}
