import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { IndexPage } from '../index';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ContactPage;
  tab3Root: any = AboutPage;


  tabs2Text:any = '门禁设置';
  tabs2Icon:any = 'information-circle';
  tabs3Text:any = '我的';
  tabs3Icon:any = 'contacts';

  indexShow:string = ""; //是否显示首页


  isTrue:any = false;
  constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams) {

    if(localStorage.getItem("token")!=undefined && localStorage.getItem("token")!=null && localStorage.getItem("token")!="" ){
       this.indexShow = "true";
    }else{
      this.indexShow = "";
      this.navCtrl.setRoot("IndexPage");
    }


  }
  ionViewDidLoad() {
    this.isTrue = false;

   

    if(localStorage.getItem("nav")!=undefined && localStorage.getItem("nav")!=null && localStorage.getItem("nav")!="" ){
     
      this.isTrue = true;
      this.tab2Root= AboutPage;
      this.tab3Root= ContactPage;
      this.tabs2Text = '我的';
      this.tabs2Icon = 'contacts';
      this.tabs3Text  = '门禁设置';
      this.tabs3Icon  = 'information-circle';
    
    }else{
     
      this.isTrue = false;
    }
    this.listenEvents();
    
    // console.log('界面创建');
  }
  ionViewWillUnload() {
    this.events.unsubscribe('toLogin');
    // console.log('界面销毁');
  }
  
  listenEvents() {
    this.events.subscribe('toLogin', () => {
      this.navCtrl.setRoot("IndexPage");
      // this.nav.pop(); 使用这种方式也可以，但是会在登录框中默认填上值
      // console.log('返回登录');
    });
  }
}
