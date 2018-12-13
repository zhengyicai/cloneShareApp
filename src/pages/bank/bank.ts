import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
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


  
  constructor(public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }

  list:any = [];

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankPage');
    this.loadData();
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad BankPage');
    this.loadData();
  }

  loadData(){
    this.httpSerProvider.get('/register/communityList').then((data:any)=>{
      if(data.code==='0000'){
        //this.popSerProvider.toast(data.message);   
        this.list = data.data;
      
      }else if(data.code==='9999'){
        this.popSerProvider.toast(data.message);
      }else{
        this.popSerProvider.toast(data.message);
      }
     
    });
  }

  alertCt(opt:any) {
    let alert = this.alertCtrl.create({
      title: '是否确认设置为默认小区？',
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
            this.httpSerProvider.post('/register/updateCommunityisTrue',opt).then((data:any)=>{
              if(data.code==='0000'){
                this.popSerProvider.toast(data.message);
                this.loadData();   
              }else if(data.code==='9999'){
                this.popSerProvider.toast(data.message);
              }else{
                this.popSerProvider.toast(data.message);
              }
             
            });
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirm(opt:any,$event) {
    $event.stopPropagation();
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
            this.httpSerProvider.post('/register/communityDelete',opt).then((data:any)=>{
              if(data.code==='0000'){
                this.popSerProvider.toast(data.message);
                this.loadData();   
              }else if(data.code==='9999'){
                this.popSerProvider.toast(data.message);
              }else{
                this.popSerProvider.toast(data.message);
              }
             
            });
          }
        }
      ]
    });
    alert.present();
  }


  addBank(){
    this.navCtrl.push("AddbankPage");
  }

}
