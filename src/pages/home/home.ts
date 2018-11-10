import { Component } from '@angular/core';
import { NavController,AlertController, NavParams,Platform } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private platform:Platform,  private alertCtrl:AlertController,public navCtrl: NavController, public navParams: NavParams,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,) {
    // this.alertUpate();
    // this.alertServerUpate();
  }

  showUpdate:any = true;
  banners:any;  
  param:any;
  appVersion:any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComunityListPage');
    this.loadData();
    this.appVersion = AppConfig.appVersion;
  }

  public loadData(){
        this.httpSerProvider.get('/home/findSysParam',{
          
        }).then((data:any)=>{
          if(data.code==='0000'){
            this.param = data.data;   
         

           if(this.param!='' && this.param!=null ){

                //服务器是否正在更新
                if(this.param.serviceUpdate =='1'){
                    this.alertServerUpate();
                    
                }else{
                  if (this.platform.is('ios')) {
                        //版本是否强制更新
                        if(this.param.iosForceUpdate == '1' && this.appVersion !=this.param.iosAppVersion ){
                              this.alertForceUpate();    
                        }else{
                              //更新提醒
                              if(this.appVersion != this.param.iosAppVersion){
                                this.alertUpate();
                              }
                              
                        }
                    
                  } else if (!this.platform.is('ios')) {
                        //版本是否强制更新
                        if(this.param.androidForceUpdate == '1' && this.appVersion !=this.param.androidAppVersion ){
                              this.alertForceUpate();    
                        }else{
                              //更新提醒
                              if(this.appVersion != this.param.iosAppVersion){
                                this.alertUpate();
                              }  
                        }
                  }      
                }
                
           }
           



        }else if(data.code==='9999'){
          this.popSerProvider.showImgLoading(data.message,0);
        }else{
         
        }
      });

  }


  public cancellUpdate(){
    this.showUpdate =false;
  }
  public closeUpdate(){
    this.showUpdate = true;
  }
  //版本更新
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
            if (this.platform.is('ios')) {
              window.open(this.param.iosAddr, '_system');
            } else if (!this.platform.is('ios')) {
              window.open(this.param.androidAddr, '_system');
            }
            
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
            this.platform.exitApp();
          }
        },
        {
          text: '退出',
          handler: (data: any) => {
            console.log('Radio data:', data);
            this.platform.exitApp();    
            
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
          text: '退出',
          role: 'cancel',
          handler: () => {
            this.platform.exitApp();    
            console.log('Cancel clicked');
          }
        },
        {
          text: '去更新',
          handler: (data: any) => {
            console.log('Radio data:', data);
            if (this.platform.is('ios')) {
              window.open(this.param.iosAddr, '_system');
            } else if (!this.platform.is('ios')) {
              window.open(this.param.androidAddr, '_system');
            }
            this.platform.exitApp();
        
            
        }
        }
      ]
    });
    alert.present();
  }

}
