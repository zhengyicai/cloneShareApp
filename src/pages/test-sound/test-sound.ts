import {Component} from '@angular/core';
import {App,IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';

/**
 * Generated class for the TestSoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-test-sound',
  templateUrl: 'test-sound.html',
})
export class TestSoundPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestSoundPage');
  }

  public load(){

      

  }

}
