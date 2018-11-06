import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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
  userName:string = ""; //用户名
  password:string = ""; //密码
  code:string = "";//验证码
  deviceId:string = "";
  appVersion:string = "";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpSerProvider:HttpSerProvider,
              public popSerProvider:PopSerProvider,
              ) {

                this.deviceId = AppConfig.deviceId;
                this.appVersion = AppConfig.appVersion;
  }

  ionViewDidLoad() {
    
    // this.loadData();
    

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

  gotoLogin(){
    this.navCtrl.setRoot(TabsPage);
    // if(this.validator()){
    //   this.httpSerProvider.post('/app/manage/loginIn',{
    //           loginName:this.userName,
    //           password:this.password,
    //           imgKey:this.imgKey,
    //           picCode:this.code,
    //           deviceId:AppConfig.deviceId
    //       }).then((data:any)=>{
    //       if(data.code==='0000'){
    //           localStorage.setItem('token',data.data);
    //           //缺少刷新token 以及用户安全  userinfo+key
    //           this.popSerProvider.showImgLoading("登录成功",1);
    //           this.navCtrl.setRoot('HomePage');
    //           localStorage.setItem("autoLogin","1");
    //           //自动登录获取到userId
    //           localStorage.setItem("autoKey",data.message);
    //       }else if(data.code==='9999'){
    //         this.popSerProvider.showImgLoading(data.message,0);
    //       }else{
    //         // Utils.show("登录失败，请联系管理员");
            
    //       }
    //   });
    // }
    

   


  }
  gotoRegister(){
      this.navCtrl.push("RegisterPage");
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

    if (this.code.trim() == null || this.code.trim() == '') {
      this.popSerProvider.toast("验证码不能为空");
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

    if (this.code.trim().length > 6  || this.code.trim().length < 4) {
      this.popSerProvider.toast("验证码长度有误");
      return false;
    }



    
    return true;
  }

}
