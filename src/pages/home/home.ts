import { Component,ViewChild } from '@angular/core';
import { NavController,AlertController, NavParams,Platform } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
import { Slides } from 'ionic-angular';//注入轮播
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { JsonPipe } from '@angular/common';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slides') slides: Slides;

  database: SQLiteObject;


  constructor(private sqlite: SQLite,private platform:Platform,  private alertCtrl:AlertController,public navCtrl: NavController, public navParams: NavParams,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider) {

      // this.httpSerProvider.getStatus('/home/testStatus',{    
      // }).then((data:any)=>{
      //   //this.loadData();
      // }); 
      if(localStorage.getItem("status")=='true'){
        this.loadData();
      }else{
        
      }
      
    

      
    //this.alertUpate();
    // this.alertServerUpate();
  }
 
  goToSlide() {
    this.slides.slideTo(2, 500);
  }

 


  //页面离开时停止自动播放


  ionViewDidLeave(){ 
  this.slides.stopAutoplay();
  }


 
   
  showUpdate:any = true;
  banners:any;  
  param:any;
  appVersion:any;
  communityName:any = "首页";
  showButton:any = false;  
  showUnlockCount1: any = 0;  //用户显示未绑定的设备
  showUnlockCount2: any = 0;  //物业显示未绑定的设备
  isTrue:any = true;
  ionViewDidEnter(){




    this.slides.startAutoplay();
    if(localStorage.getItem("status")=='true'){
      this.initDB2();  //同步离线开锁记录
      this.httpSerProvider.get('/home/findCommunityData',{
                
        }).then((data:any)=>{
          if(data.code==='0000'){
          this.communityName = data.data.communityName==null?'首页':data.data.communityName;   
          localStorage.setItem("communityData",JSON.stringify(data.data));
          localStorage.setItem("userId",JSON.stringify(data.data.residentId));
          this.showUnlockCount1 = data.data.equRoomState;
        
        }else if(data.code==='9999'){
          this.popSerProvider.showImgLoading(data.message,0);
        }else{
        
        }
      });
    }else{
      
    }
  }



  public initDB2(){
    this.sqlite.create({
     name: 'data.db',
     location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('select * from record1 where status="20"',[])
      .then(res => {

        //alert(res.rows.length);
        var arr = new Array(res.rows.length);
        
        for(var i = 0;i<res.rows.length;i++){
          arr[i] = res.rows.item(i);
        }

         //联网
         if(localStorage.getItem("status")=='true'){
          
          if(res.rows.length>0){
            this.httpSerProvider.post('/home/uploadLockRecord',arr).then((data:any)=>{
              if(data.code==='0000'){
                
                for(var i = 0 ;i<arr.length;i++){
                  db.executeSql("UPDATE record1 set status='10' WHERE id="+arr[i].id+";",[]);
                }
               
              }else if(data.code==='9999'){
                this.popSerProvider.toast(data.message);
              
              }else{
                this.popSerProvider.toast(data.message);
              
              }
           
            });
          }
          
        }else{
            
        }  

        
      
        
      })
      .catch(e => console.log(e));
      this.database = db;
    });   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComunityListPage');
   
    this.appVersion = AppConfig.appVersion;

    if(localStorage.getItem("nav")!=undefined && localStorage.getItem("nav")!=null && localStorage.getItem("nav")!="" ){
      this.isTrue = false;
    }else{
      this.isTrue = true;
    }

  }

  public loadData(){


          this.httpSerProvider.get('/home/findCommunityData',{
                
          }).then((data:any)=>{
            if(data.code==='0000'){
            this.communityName = data.data.communityName==null?'首页':data.data.communityName;   
            localStorage.setItem("communityData",JSON.stringify(data.data));
            localStorage.setItem("userId",JSON.stringify(data.data.residentId));

            this.showUnlockCount1 = data.data.equRoomState;
            
            this.httpSerProvider.get('/home/findRoomCardData',{
                  communityId:data.data.community
                }).then((data:any)=>{
                  if(data.code==='0000'){
                 localStorage.setItem("cardData",JSON.stringify(data.data))
                
                }else if(data.code==='9999'){
                  this.popSerProvider.showImgLoading(data.message,0);
                }else{
                
                }
            });
          
          }else if(data.code==='9999'){
            this.popSerProvider.showImgLoading(data.message,0);
          }else{
          
          }
        });
    


        this.httpSerProvider.get('/home/findSysParam',{
          
        }).then((data:any)=>{
          if(data.code==='0000'){
            this.param = data.data;   
                     
           if(this.param!='' && this.param!=null ){

                if(this.param.buttonShow =='1'){
                  this.showButton  = true;
                }else{
                  this.showButton = false;
                }

                if(!this.platform.is('ios')){
                  this.showButton  = true; 
                }

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
                              
                              if(this.appVersion != this.param.androidAppVersion){
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


  public  testSound1(){
    this.navCtrl.push("TestSoundPage");
  }

  public addCard(){
    if(localStorage.getItem("status")=='true'){
       this.navCtrl.push("DeviceListPage");
    }else{
      this.popSerProvider.toast("添加卡号请先开启网络");  
    }
    
  }

  public addUserCard(){
      if(localStorage.getItem("status")=='true'){
        this.navCtrl.push("UserDeviceListPage");
      }else{
        this.popSerProvider.toast("物业添卡请先开启网络");  
      }
  }

  public  unlock(){
    this.navCtrl.push("UnlockPage");
  }


  public  authUser(){
    this.navCtrl.push("AuthUserPage");
  }

  public lockRecord(){
    this.navCtrl.push("LockRecordPage");
  }

  public  contantPro(){
    this.navCtrl.push("ContantPropertyPage");
  }

  public alertPage(){
    let alert = this.alertCtrl.create({
      title: '',
      message: '新功能正在上线中，尽请期待~',
      buttons: [
       
        {
          text: '确定',
          handler: (data: any) => {
            console.log('Radio data:', data);
           
            
        }
        }
      ]
    });
    alert.present();
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



  public testSound(){
    this.navCtrl.push("SoundDecodePage");
    
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
