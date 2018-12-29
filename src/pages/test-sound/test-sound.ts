import {Component} from '@angular/core';
import {App,IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { File } from '@ionic-native/file';

/**
 * Generated class for the TestSoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 
declare var audioinput: any;

@IonicPage()
@Component({
  selector: 'page-test-sound',
  templateUrl: 'test-sound.html',
})


export class TestSoundPage {

  constructor(private file: File ,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
    var captureCfg = {
          sampleRate: audioinput.SAMPLERATE.CD_AUDIO_44100Hz,
          bufferSize: 16384,
          channels: audioinput.CHANNELS.MONO,
          format: audioinput.FORMAT.PCM_16BIT,
          normalize: true,
          normalizationFactor: 32767.0,
          streamToWebAudio: false,
          audioContext: null,
          concatenateMaxChunks: 10,
          audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT,
          fileUrl: this.file.externalDataDirectory + "temp.wav"
          
      };
    audioinput.start(captureCfg);
 
  }

  stop(){
    audioinput.stop();
     
  }


    


  

 
}
