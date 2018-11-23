import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,Platform,AlertController} from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  
  constructor( private alertCtrl:AlertController,private platform:Platform,private httpSerProvider: HttpSerProvider, private events: Events,public pop:PopSerProvider, public camera:Camera, public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl: ActionSheetController) {
    this.appVersion = AppConfig.appVersion;
  }

  appVersion:any = "";
  gender:any = "f";
  auto:any = true;
  isCheck =false;  //更新提醒
  param:any;
  highVersion:any = "";//最新版本
  isTrue:any = true;
  userName:any = "用户名";
  ionViewDidLoad() {
    if(localStorage.getItem("status")=='true'){
      this.loadData();
    }else{
      
    }
    //this.loadData();
    if(localStorage.getItem("nav")!=undefined && localStorage.getItem("nav")!=null && localStorage.getItem("nav")!="" ){
      this.isTrue = false;
    }else{
      this.isTrue = true;
    }
  }


  public loadData(){
    var option = JSON.parse(localStorage.getItem("communityData")); 
    this.userName = option.userName ==null?'用户名':option.userName;
    this.httpSerProvider.get('/home/findSysParam',{
          
    }).then((data:any)=>{
      if(data.code==='0000'){
        this.param = data.data;   
     

       if(this.param!='' && this.param!=null ){

            //服务器是否正在更新
            if(this.param.serviceUpdate =='1'){
               // this.alertServerUpate();
                
            }else{
              if (this.platform.is('ios')) {
                this.highVersion= this.param.iosAppVersion;
                if(this.highVersion == this.appVersion){
                  this.isCheck =false;
                }else{
                  this.isCheck =true;
                }
              } else if (!this.platform.is('ios')) {
                this.highVersion= this.param.androidAppVersion;
                if(this.highVersion == this.appVersion){
                  this.isCheck =false;
                }else{
                  this.isCheck =true;
                }
                  
              }      
            }
            
       }
       



    }else if(data.code==='9999'){
      this.pop.showImgLoading(data.message,0);
    }else{
     
    }
  });
  }
  
  updateName(){
   
    this.navCtrl.push("UpdateNamePage");
  }

  updatePwd(){
    this.navCtrl.push("UpdatePwdPage");
  }
  Exit(){
    localStorage.removeItem("token");
    localStorage.removeItem('nav');
    this.events.publish('toLogin');
    
  }
  gotoMo(){
    this.navCtrl.push("ModificationOnePage");
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.takePicture(this.camera.PictureSourceType.CAMERA, 1);
          }
        },
        {
          text: '相册',
          handler: () => {
            console.log('Archive clicked');
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, 2);
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }


  takePicture(sourceType, index) {
    //上传的参数设置

    let options = {
      quality: 70,
      sourceType: sourceType,
      destinationType: 0,
      targetHeight: 360,
      targetWidth: 360,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };
    this.camera
      .getPicture(options)
      .then(
        imageData => {
          if (imageData.length > 410000) {
            //判断图片的大小
            alert("图片过大");
          } else {
            let image = 'data:image/jpeg;base64,' + imageData;
            let imglist = [];
            imglist.push(image);

            // let imgData = {
            //   imgPath: image,
            // };
            //this.changeBtn = true;
            // this.api.postMd5('setting/user/upImg', imgData, imgData).then((respData: any) => {
            //   this.changeBtn = false;
            //   if (respData['code'] == '0000') {
            //     this.nativeService.showImgLoading(
            //       this.nativeService.getTranslateValue('nickName_Modify_successfully'),
            //       1,
            //     );
            //     this.showImage = image;
            //   } else {
            //     this.nativeService.showImgLoading(respData['message'], 0);
            //   }
            // });
          }
        },
        err => {
          console.warn(err);
        },
      )
      .catch(() => {
        if (index == 1) {
         // this.pop.checkCamera();
        } else {
         // this.pop.checkStorage();
        }
      });
  }


  //版本更新
  public alertUpate(){
    if(this.isCheck){
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
    
  }

  public addCom(){
    this.navCtrl.push("BankPage");
  }

}
