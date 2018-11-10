import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';


/**
 * Generated class for the UpdatePwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-update-pwd',
  templateUrl: 'update-pwd.html',
})
export class UpdatePwdPage {

  constructor(private appCtrl: App,public navCtrl: NavController, public navParams: NavParams ,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider) {
  }
  subData:any = {
    oldPwd:"",
    password:""
   
  }

  truePwd:any ="";

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePwdPage');
  }



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
        this.httpSerProvider.post('/login/updatePwd',this.subData).then((data:any)=>{
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
    

    if (this.subData.oldPwd.trim() == null || this.subData.oldPwd.trim() == '') {
      this.popSerProvider.toast("旧密码不能为空");
      return false;
    }
  
    if (this.subData.oldPwd.trim().length > 12  || this.subData.oldPwd.trim().length < 3) {
      this.popSerProvider.toast("旧密码长度有误");
      return false;
    }

    if (this.subData.password.trim() == null || this.subData.password.trim() == '') {
      this.popSerProvider.toast("新密码不能为空");
      return false;
    }
  
    if (this.subData.password.trim().length > 12  || this.subData.password.trim().length < 3) {
      this.popSerProvider.toast("新密码长度有误");
      return false;
    }

    if (this.truePwd.trim() == null || this.truePwd.trim() == '') {
      this.popSerProvider.toast("确认密码不能为空");
      return false;
    }
  
    if (this.truePwd.trim().length > 12  || this.truePwd.trim().length < 3) {
      this.popSerProvider.toast("确认密码长度有误");
      return false;
    }

    if (this.subData.password.trim() != this.truePwd.trim()) {
      this.popSerProvider.toast("新密码和确认密码不一致");
      return false;
    }

    return true;
  }

}
