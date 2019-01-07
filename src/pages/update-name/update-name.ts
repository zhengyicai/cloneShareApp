import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App ,Events} from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';

/**
 * Generated class for the UpdateNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-update-name',
  templateUrl: 'update-name.html',
})
export class UpdateNamePage {

  constructor(private events:Events, private appCtrl: App,public navCtrl: NavController, public navParams: NavParams ,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateNamePage');
  }

  subData:any = {
    name:""
   
  }

  truePwd:any ="";

 



   //重复提交倒计时
verifyCode1: any = {
  countdown: AppConfig.requestTime,
  disable: true
}

// 倒计时
settime1() {

  if (this.verifyCode1.countdown == 1) {
  this.verifyCode1.countdown = AppConfig.requestTime;
  this.verifyCode1.disable = true;
  return;
  } else {
  this.verifyCode1.countdown--;
  }


  setTimeout(() => {

    this.settime1();
  }, 1000);
}
  gotoupdatePwd(){
      
      if(this.validator()){
        this.verifyCode1.disable = false;
        this.settime1();
        this.httpSerProvider.post('/login/updateName',this.subData).then((data:any)=>{
          if(data.code==='0000'){
            this.popSerProvider.toast(data.message);
            this.appCtrl.getActiveNav().pop();
           
          }else if(data.code==='9999'){
            this.popSerProvider.toast(data.message);
          }else{
            this.popSerProvider.toast(data.message);
            
          }
          this.verifyCode1.countdown  = 1;
          this.verifyCode1.disable = true;
    });
        
      }



  }
  //验证
  validator() {
    

    if (this.subData.name.trim() == null || this.subData.name.trim() == '') {
      this.popSerProvider.toast("昵称不能为空");
      return false;
    }
  
    if (this.subData.name.trim().length > 12  || this.subData.name.trim().length < 2) {
      this.popSerProvider.toast("昵称长度有误");
      return false;
    }


    return true;
  }


}
