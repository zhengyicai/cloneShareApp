import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';

/**
 * Generated class for the ContantPropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contant-property',
  templateUrl: 'contant-property.html',
})
export class ContantPropertyPage {

  contantMobile:any;
  constructor(private appCtrl: App,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContantPropertyPage');
    this.contantMobile  = JSON.parse(localStorage.getItem("communityData")).adminMobile;
    if(this.contantMobile =="" || this.contantMobile ==null){
      // let alert = this.alertCtrl.create({

      //   title: "请先绑定默认小区并等待管理员审核通过",
      //   message: '',
      //   buttons: [
          
      //     {
      //       text: "确认",
      //       handler: () => {
      //         this.appCtrl.getActiveNav().pop();
      //       },
      //     },
      //   ],
      // });
      // alert.present();
      this.contantMobile = "联系电话："+13412341234;
  

    }else{
      //this.contantMobile = "联系电话："+JSON.parse(localStorage.getItem("communityData")).adminMobile;
      this.contantMobile = "联系电话："+13412341234;
    }
  }

}
