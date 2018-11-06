import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,Platform } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import { AppConfig } from '../../app/app.config';
import { PopSerProvider } from '../../providers/pop-ser/pop-ser';
import { Slides } from 'ionic-angular';//注入轮播
/*import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';*/
import {APP_PIC_URL} from '../../app/app.config';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface SystemPara {
  /** android 下载地址 */
  webAppIOSDownload?: string;
  /** ios 下载地址 */
  webAppAndroridDownload?: string;
  /** 更新内容 */
  webAppUpdateContent?: string;
  /** 当前版本 */
  webAppVersions?: string;
}


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('mySlider') slider:Slides;
  mySlideOptions={
    autoplay:2000,
    initialSlide:0,
    pager:true,
    loop:true,
    speed:300
    };

  showUpdate:any = false;
  systemPara: SystemPara = {}; /*{//系统参数}*/
  banners:any;  
  imgUrl:any = '';
 
  coinManage:any;//币种数量

  constructor(public platform:Platform,  public popSerProvider:PopSerProvider,private httpSerProvider:HttpSerProvider,  public navCtrl: NavController, public navParams: NavParams, public events: Events,) {
      //this.getSystemPara();
      //his.loadMenu();  
      //this.loadProjectData();
      this.loadData();
      this.imgUrl = APP_PIC_URL;

      
  }
  

  ngOnInit(){//页面加载完成后自己调用
    // setInterval(()=>{
    // this.slider.slideNext(300,true);
    // },2000);
  }
    

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
   
    //this.getSystemPara();

    
    this.loadData();
    
    //alert(AppConfig.deviceId);
      
  }


  //下拉刷型界面
  doRefresh(refresher){

    console.log("下拉刷新");
    this.loadData();
    setTimeout(() => { 
        console.log('加载完成后，关闭刷新'); 
        refresher.complete();

        //toast提示
        
        this.popSerProvider.toast("加载成功");
    }, 2000);
  }
   
  gotoSetting(){
      this.navCtrl.push('SettingPage');
  }


  //跳转界面
  pushNav(str:any=""){
    this.navCtrl.push(str);
  }

  //加载数据
  loadData(){
      //this.httpSerProvider.get("/home/findBanners");
      this.httpSerProvider.get('/home/findBanners').then((respData: any) => {
           if (respData.code == '0000') {
             //this.popSerProvider.alert(respData.data);
            this.banners = respData.data;
           } else {
             this.popSerProvider.alert(respData.message);
           }
      });
  }
  


  loadProjectData(){

   

  }

  //新功能未开方
  alertPage(){
    this.popSerProvider.alert("该功能暂未开放");

  }

  

  /** 取消更新 */
  cancellUpdate() {
    AppConfig.updateshow = false;
    this.showUpdate = AppConfig.updateshow;
   
  }

  closeUpdate() {
    AppConfig.updateshow = false;
    this.showUpdate = AppConfig.updateshow;
    

    // 判断当前手机系统
    if (this.platform.is('ios')) {
      window.open(this.systemPara.webAppIOSDownload, '_system');
    } else if (!this.platform.is('ios')) {
      window.open(this.systemPara.webAppAndroridDownload, '_system');
    }
  }

  

}
