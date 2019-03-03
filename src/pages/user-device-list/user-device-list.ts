import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';

/**
 * Generated class for the UserDeviceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-device-list',
  templateUrl: 'user-device-list.html',
})
export class UserDeviceListPage {

  constructor(public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }

  equList:any;
  option:any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceListPage');
    this.loadData();
  }


  ionViewDidEnter(){
		this.loadData();
	}

 


  loadData(){
    
    this.option  = JSON.parse(localStorage.getItem("communityData"));

    var person = {
      communityId:this.option.community
    }


    this.httpSerProvider.get('/equipment/getCommunity',person).then((data:any)=>{
          if(data.code==='0000'){
            //this.citylist = data.data;
            this.equList = data.data;
          }else if(data.code==='9999'){
            this.popSerProvider.toast(data.message);
          }else{
            this.popSerProvider.toast(data.message); 
          }  
    });
  }




  deviceDetail(detail:any){
    this.navCtrl.push("UserRoomCardListPage",{equipmentId:detail,roomId:this.option.defaultRoomId});
  }
}
