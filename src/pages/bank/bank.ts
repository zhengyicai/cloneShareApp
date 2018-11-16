import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the BankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html',
})
export class BankPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankPage');
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: '是否确认删除？',
      message: '',
      buttons: [
        {
          text: '返回',
          role: '返回',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确认',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }


  addBank(){
    //this.navCtrl.push("AddbankPage");
  }

}
