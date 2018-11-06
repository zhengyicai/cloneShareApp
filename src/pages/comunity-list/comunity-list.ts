import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController,NavParams } from 'ionic-angular';

/**
 * Generated class for the ComunityListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comunity-list',
  templateUrl: 'comunity-list.html',
})
export class ComunityListPage {

  constructor(private alertCtrl:AlertController,public navCtrl: NavController, public navParams: NavParams) {
    // this.alertUpate();
    // this.alertServerUpate();
    this.alertForceUpate();
  }

  showUpdate:any = true;
  banners:any;  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComunityListPage');
  }
  public cancellUpdate(){
    this.showUpdate =false;
  }
  public closeUpdate(){
    this.showUpdate = true;
  }
  //设置设备编码
  public alertUpate(){
    let alert = this.alertCtrl.create({
      title: '更新',
      message: '发现新版本，是否立即更新？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '去更新',
          handler: (data: any) => {
            console.log('Radio data:', data);
            
        }
        }
      ]
    });
    alert.present();
  }

  public alertServerUpate(){
    let alert = this.alertCtrl.create({
      title: '维护',
      message: '服务器正在维护中，请不要操作',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '退出',
          handler: (data: any) => {
            console.log('Radio data:', data);
            
        }
        }
      ]
    });
    alert.present();
  }


  public alertForceUpate(){
    let alert = this.alertCtrl.create({
      title: '更新',
      message: '当前版本过低，请更新到最新版本',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '去更新',
          handler: (data: any) => {
            console.log('Radio data:', data);
            
        }
        }
      ]
    });
    alert.present();
  }

}
