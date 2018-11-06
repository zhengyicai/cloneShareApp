import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(private events: Events,public pop:PopSerProvider, public camera:Camera, public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl: ActionSheetController) {
  }


  gender:any = "f";
  auto:any = false;

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  gotoRevise(){
    this.navCtrl.push("RevisePage");
  }
  gotoAlert(){
    this.navCtrl.push("AlertPage");
  }
  gotoBank(){
    this.navCtrl.push("BankPage");
  }
  gotoMoney(){
    this.navCtrl.push("MoneyPage");
  }

  gotoSuggest(){
    this.navCtrl.push("SuggestPage");
  }

  Exit(){
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
 
}
