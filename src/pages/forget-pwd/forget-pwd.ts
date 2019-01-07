import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { TabsPage } from '../tabs/tabs';
import { IndexPage } from '../index/index';
import { AppConfig } from '../../app/app.config';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-pwd',
  templateUrl: 'forget-pwd.html',
})
export class ForgetPwdPage {


  subData:any = {
    name:"",
    password:"",
    smsCode:"",
    mobile:""
  }
  constructor(private appCtrl: App,public navCtrl: NavController, public navParams: NavParams ,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

   // 验证码倒计时
   verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
}
// 倒计时
settime() {
    if (this.verifyCode.countdown == 1) {
    this.verifyCode.countdown = 60;
    this.verifyCode.verifyCodeTips = "获取验证码";
    this.verifyCode.disable = true;
    return;
    } else {
    this.verifyCode.countdown--;
    }

    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    setTimeout(() => {
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    this.settime();
    }, 1000);
}
getCode() {
    if (this.subData.mobile == '') {
      this.popSerProvider.toast("请填写手机号!");
    return;
    }

    //发送验证码成功后开始倒计时

    this.verifyCode.disable = false;
    this.send();
    this.settime();

}


  public send(){
      this.httpSerProvider.get('/common/sms',{
      mobile:this.subData.mobile
      }).then((data:any)=>{
            if(data.code==='0000'){
              this.popSerProvider.toast(data.message);
            }else if(data.code==='9999'){
              this.popSerProvider.toast(data.message);
            }else{
              this.popSerProvider.toast(data.message);
              
            }
      });
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

  //提交注册
  public  gotoRegister (){  
      if(this.validator()){
        this.verifyCode1.disable = false;
        this.settime1();
        this.httpSerProvider.post('/login/findPwd',this.subData).then((data:any)=>{
                if(data.code==='0000'){
                  this.popSerProvider.toast(data.message);
                  this.popSerProvider.showImgLoading("修改成功",1);
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
   
    if (this.subData.mobile.trim() == null || this.subData.mobile.trim() == '') {
      this.popSerProvider.toast("手机号不能为空");
      return false;
    }

    if (this.subData.password.trim() == null || this.subData.password.trim() == '') {
      this.popSerProvider.toast("密码不能为空");
      return false;
    }
    if (this.subData.smsCode.trim() == null || this.subData.smsCode.trim() == '') {
      this.popSerProvider.toast("验证码不能为空");
      return false;
    }
    
  
    if (this.subData.mobile.trim().length > 12  || this.subData.mobile.trim().length < 8) {
      this.popSerProvider.toast("手机号长度有误");
      return false;
    }
  
    if (this.subData.password.trim().length > 12  || this.subData.password.trim().length < 3) {
      this.popSerProvider.toast("密码长度有误");
      return false;
    }

    if (this.subData.smsCode.trim().length > 6  || this.subData.smsCode.trim().length < 2) {
      this.popSerProvider.toast("验证码长度有误");
      return false;
    }
  
    return true;
  }

}
