import {Component} from '@angular/core';
import {App,IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
import { TabsPage } from '../tabs/tabs';

//import { AppConfig } from '../../app/app.config';

/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {
  imgStr:string;//图片验证码
  imgKey:string;//验证码对应的key
  indexShow:string = "true"; //是否显示首页
  //userName:string = "13612341234"; //用户名
  //password:string = "123456"; //密码
  userName:string = "wuye2"; //用户名
  password:string = "1q2w3e"; //密码
  code:string = "";//验证码
  deviceId:string = "";
  appVersion:string = "";
  constructor(
              public app:App,
              public navCtrl: NavController,
              public navParams: NavParams,
              public httpSerProvider:HttpSerProvider,
              public popSerProvider:PopSerProvider,
              ) {
                
               
                //this.deviceId = AppConfig.deviceId;
                
                this.appVersion = AppConfig.appVersion;

                // if(localStorage.getItem("token")!=undefined && localStorage.getItem("token")!=null && localStorage.getItem("token")!="" ){
                //   this.indexShow = "";
                //   this.navCtrl.setRoot(TabsPage);
                // }else{
                //   this.indexShow = "true";
            
                // }


                //  //this.deviceId = AppConfig.deviceId;
                //  this.appVersion = AppConfig.appVersion;
                //  if(localStorage.getItem("token")!=undefined && localStorage.getItem("token")!=null && localStorage.getItem("token")!="" ){
                //    //alert("fuck");
                //    this.navCtrl.setRoot(TabsPage);
                //  }else{
                //    //this.navCtrl.setRoot(IndexPage);
                //  }
                
  }



  ionViewDidLoad() {

  }

  loadData(){

    // let person = {
    //   paraName: 'versions',
    // };
    // this.httpSerProvider.get('common/findParameter', person).then((respData: any) => {
    //   if (respData.code == '0000') {
    //     this.popSerProvider.alert(respData.data);
    
    //   } else {
    //     this.popSerProvider.alert(respData.message);
    //   }
    // });
   


  }


  gotoPrivary(){
    this.navCtrl.push("PrivacyPage");
  }
  gotoLogin(){
    //this.navCtrl.setRoot(TabsPage);
    if(this.validator()){
      this.verifyCode.disable = false;
      this.settime();
      
      this.httpSerProvider.post('/login/loginIn',{
              loginName:this.userName,
              password:this.password
          }).then((data:any)=>{
          if(data.code==='0000'){
              localStorage.setItem('token',data.data);

              this.popSerProvider.showImgLoading("登录成功",1);
              this.navCtrl.setRoot(TabsPage);  
              //this.app.getRootNav().setRoot(TabsPage);

          }else if(data.code==='1000'){
              localStorage.setItem('token',data.data);
              localStorage.setItem('nav',"true");
              this.popSerProvider.showImgLoading("登录成功",1);
              this.navCtrl.setRoot(TabsPage);  
          }else if(data.code==='9999'){
            this.popSerProvider.showImgLoading(data.message,0);
          }else{
            // Utils.show("登录失败，请联系管理员");
            
          }
          this.verifyCode.countdown  = 1;
          this.verifyCode.disable = true;
      });
    }
    

   


  }
  gotoRegister(){    
      this.navCtrl.push("RegisterPage");
  }

  gotoforgetPwd(){
    this.navCtrl.push("ForgetPwdPage");
  }

 // 验证码倒计时
 verifyCode: any = {
      countdown: AppConfig.requestTime,
      disable: true
  }

  // 倒计时
settime() {
 
  if (this.verifyCode.countdown == 1) {
    this.verifyCode.countdown = AppConfig.requestTime;
    this.verifyCode.disable = true;
   // this.popSerProvider.toast("登录有误,请检查您的网络或联系管理员");
  return;
  } else {
  this.verifyCode.countdown--;
  }


  setTimeout(() => {

      this.settime();
  }, 1000);
}


  //验证
  validator() {
    if (this.userName.trim() == null || this.userName.trim() == '') {
      this.popSerProvider.toast("用户名不能为空");
      return false;
    }
    if (this.password.trim() == null || this.password.trim() == '') {
      this.popSerProvider.toast("密码不能为空");
      return false;
    }

  
    if (this.password.trim().length > 32  || this.password.trim().length < 3) {
      this.popSerProvider.toast("密码长度有误");
      return false;
    }

    if (this.userName.trim().length > 32  || this.userName.trim().length < 2) {
      this.popSerProvider.toast("用户名长度有误");
      return false;
    }
  
    return true;
  }

}
