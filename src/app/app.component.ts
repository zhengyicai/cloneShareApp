import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, App, AlertController, Events,NavController,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { HttpSerProvider } from '../providers/http-ser/http-ser';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IndexPage } from '../pages/index/index';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AppConfig } from './app.config';
import {Network} from "@ionic-native/network";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  @ViewChild('content')navCtrl:NavController;
  rootPage: any = TabsPage;
  //pages: Array<{title: string, component: any}>;
  pages: any;
  public backButtonPressed: boolean = false;
  constructor(private network: Network,public menuCtrl: MenuController,public uniqueDeviceID:UniqueDeviceID,public events: Events,  private alertCtrl: AlertController, private appCtrl: App, private platform: Platform, public statusBar: StatusBar, splashScreen: SplashScreen, private toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkNetwork();  //写入函数，让app启动后进行网络监测
      
      //获取设备号
      this.uniqueDeviceID.get().then((uuid: any) => 
          //console.log(uuid)
          AppConfig.deviceId = uuid
       ).catch((error: any) => 
          //默认设备号
          AppConfig.deviceId = "sutongbao2018!@#$"
      );



      //状态栏的颜色
      if(platform.is('ios')){
          //this.statusBar.backgroundColorByHexString('#147AFE');
      }else{
          this.statusBar.backgroundColorByHexString('#ffffff');
      }
      
      


      //设置启动的首页
      
      // if(localStorage.getItem("token") != '' && localStorage.getItem("token") != undefined ){
      //   this.rootPage = TabsPage;
        
      // }else{
        // /this.rootPage = IndexPage;
        
      //}
      

      
    });

    platform.ready().then(() => {
      this.exitApp();
      //监听模式  
      this.events.subscribe('user:menu', (data) => {
        // this.loggedIn = true;
       
        this.pages = data;
      });
      
    })

    //设置首页导航栏的模块
    // this.pages = AppConfig.menuData;
    // console.log("test" + AppConfig.menuData);

  }

  getChilderMenu(pid:string){
    let lis = [];
    for(var o in this.pages){
        if(this.pages[o].parentId===pid){
            lis.push(this.pages[o]);
        }
    }
    return lis;
  }


  //检测网络，若未连接网络，给出提示
  checkNetwork() {
    if(this.network.type === 'unknown') {
      localStorage.setItem("status","false");
    } else if(this.network.type === 'none') {
      localStorage.setItem("status","false");
    } else  if(this.network.type ==null) {  //针对pc写的，pc的status为null
      localStorage.setItem("status","true");
    }else{
      localStorage.setItem("status","true");  
      
    }

    //监控过程网络状态改变
    let connectSubscription = this.network.onConnect().subscribe(() => {
      localStorage.setItem("status","true");  
    });

    //监控过程网络状态改变 
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      localStorage.setItem("status","false");
    });
    //alert(sessionStorage.getItem("status"));

    

  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    
    this.nav.push(page);
  }






  exitApp() {

    this.platform.registerBackButtonAction(() => {
      //控制modal、系统自带提示框  
      let overlay = this.appCtrl._appRoot._overlayPortal.getActive() || this.appCtrl._appRoot._modalPortal.getActive();
      if (overlay) {
        overlay.dismiss();
        return;
      }
      let activeVC = this.nav.getActive();
      let page = activeVC.instance;
      if (page.tabs) {
        let activeNav = page.tabs.getSelected();
        if (activeNav.canGoBack()) {
          return activeNav.pop();
        } else {
          return this.showExit();
        }
      }
      if (page instanceof IndexPage || page instanceof HomePage) {//查看当前页面是否是登陆页面  
        this.showExit();
        return;
      }

      //处理tabs退出 子页面返回上一页  
      const nav = this.appCtrl.getActiveNav();

      if (overlay && overlay.dismiss) {
        this.showExit();
       
        return;
      } else if (nav.canGoBack()) {  //tabs子页面和其他页面
        this.appCtrl.getActiveNav().pop();
       
        return;
      } else {  //tabs
        this.showExit();
        return; 
      }
      
    });
  }

  //双击退出函数  
  showExit() {

    //阻止事件冒泡

    let alert = this.alertCtrl.create({
      title: "是否确认退出？",
      message: '',
      buttons: [
        {
          text: "返回",
          role: "返回",
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: "确认",
          handler: () => {
            this.platform.exitApp();
          },
        },
      ],
    });
    alert.present();


    // if (this.backButtonPressed) {  
    //   this.platform.exitApp();  
    // } else {  
    //   this.presentToast();//再按一次退出  
    //   this.backButtonPressed = true;  
    //   setTimeout(() => {  
    //     this.backButtonPressed = false;  
    //   }, 2000)  
    // }  
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: '再按一次退出应用',
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  loginOut(){
    let alert = this.alertCtrl.create({
      title: "是否确认退出？",
      message: '',
      buttons: [
        {
          text: "返回",
          role: "返回",
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: "确认",
          handler: () => {
            this.menuCtrl.close();
            this.navCtrl.setRoot('IndexPage');
            localStorage.setItem("autoLogin","0");
            localStorage.setItem('token','');
            localStorage.setItem('nav','');
            localStorage.setItem('autoKey','');
            
          },
        },
      ],
    });
    alert.present();
    
    //自动登录获取到userId

    //localStorage.setItem("autoKey",data.message);
    
  }
}
