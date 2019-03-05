import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
/**
 * Generated class for the DeviceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-device-list',
  templateUrl: 'device-list.html',
})
export class DeviceListPage {

  constructor(public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,private appCtrl: App,public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }


  equList:any;
  option:any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceListPage');

     //验证是否绑定小区
     this.option  = JSON.parse(localStorage.getItem("communityData"));
      var person = {
        roomId:this.option.roomId,
        defaultRoomId:this.option.defaultRoomId,
      }
      if(person.defaultRoomId=="" || person.defaultRoomId==null){
        let alert = this.alertCtrl.create({
          title: "请先绑定默认小区并等待管理员审核通过",
          message: '',
          buttons: [
            
            {
              text: "确认",
              handler: () => {
                this.appCtrl.getActiveNav().pop();
              },
            },
          ],
        });
        alert.present();
        return;
      }
    this.loadData();
  }


  ionViewDidEnter(){
    //验证是否绑定小区
    this.option  = JSON.parse(localStorage.getItem("communityData"));
    var person = {
      roomId:this.option.roomId,
      defaultRoomId:this.option.defaultRoomId,
    }
    if(person.defaultRoomId=="" || person.defaultRoomId==null){
     
      return;
    }
		this.loadData();
	}

 


  loadData(){
    
    this.option  = JSON.parse(localStorage.getItem("communityData"));
    var person = {
      roomId:this.option.roomId,
      defaultRoomId:this.option.defaultRoomId,
    }


    
    this.httpSerProvider.get('/equipment/getlist',person).then((data:any)=>{
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
    this.navCtrl.push("RoomCardListPage",{equipmentId:detail,roomId:this.option.defaultRoomId});
  }
  

}
