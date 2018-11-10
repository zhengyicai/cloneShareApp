import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ContactPage;
  tab3Root: any = AboutPage;

  constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams) {

  }
  ionViewDidLoad() {
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
