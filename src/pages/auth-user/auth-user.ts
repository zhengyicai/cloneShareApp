import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform, Thumbnail,App } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {APP_FILE_URL} from '../../app/app.config';
import { Clipboard } from '@ionic-native/clipboard';

/**
 * Generated class for the AuthUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-auth-user',
  templateUrl: 'auth-user.html',
})
export class AuthUserPage {

  constructor( private clipboard: Clipboard,public httpSerProvider:HttpSerProvider,private appCtrl: App,public popSerProvider:PopSerProvider,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
    this.fileDownload ="";
  }

  //重复提交倒计时
  verifyCode1: any = {
    countdown: AppConfig.requestTime,
    disable: true
  }

  loading:any = "";
  fileDownload:any = ""; //文件路径
  isCheck:boolean =false;   //控制打开 true:success false:unsuccess
  public appconfig:any;
  public filePath : any; //录音文件的名字
  public recordData : any; //录音对象

  csArray:any = new Array(2); //厂商代码byte两位
  areaArray:any = new Array(3); //项目代码byte三位
  equArray:any = new Array(5); //设备代码byte三位
  crc16:any = new Array(5);

  icodeArray= new Array(6); //序列号

  areaCode:any="";
  userCode:any = "";
  equCode:any= "";  //设备编码
  fileUrl:any;  //文件存放地址 
  ionViewDidLoad() {
      this.isCheck = false;
      this.loadData();
    // setTimeout(() => {

    //    alert("fuck");
    // }, 4000);
    if (this.platform.is('ios')) {
      this.fileUrl = this.file.tempDirectory;
    //alert(this.fileUrl);
    } else if (!this.platform.is('ios')) {
      this.fileUrl = this.file.externalDataDirectory;  
    }      

    //this.adminUnlock();

    


  }

  public loadData(){
    var option = JSON.parse(localStorage.getItem("communityData"));   
    var csCode = option.csCode;  //厂商代码   10进制
    var areaCode= option.areaCode;  //项目代码   10进制
    this.areaCode=areaCode;
    this.userCode = option.roomId; //


    //判断用户是否有绑定小区
    if(this.areaCode =="" || this.areaCode ==null){
      let alert = this.alertCtrl.create({
        title: "请先绑定默认小区并等待管理员审核通过",
        message: '',
        buttons: [
          
          {
            text: "确认",
            handler: () => {
              this.appCtrl.getActiveNav().pop();
            },
          },
        ],
      });
      alert.present();
  

    }
    //厂商byte
    var cslist = this.intToBytes(csCode);
    this.csArray[0] = cslist[0];
    this.csArray[1] = cslist[1];

   
   //项目byte
    var arealist =  this.intToBytes(parseInt(areaCode));
    this.areaArray[0]=arealist[0];
    this.areaArray[1]=arealist[1];
    this.areaArray[2]=arealist[2];


    //小区不进行转换，直接获取两位的数据,不够补零
    console.log("equArray"+  this.equArray);  

   
    this.crc16[0] =  this.csArray[1];
    this.crc16[1] =  this.csArray[0];
    this.crc16[2] =  this.areaArray[2];
    this.crc16[3] =  this.areaArray[1];
    this.crc16[4] =  this.areaArray[0];


    
  }

  public  intToBytes(value:any){ 
	
		var src = new Array(4);
		src[3] =  ((value>>24) & 0xFF);
		src[2] =  ((value>>16) & 0xFF);
		src[1] =  ((value>>8) & 0xFF);  
		src[0] =  (value & 0xFF);				
		return src; 

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




  public copy(){
    this.clipboard.copy(this.fileDownload);

    this.clipboard.paste().then(
      (resolve: string) => {
         this.popSerProvider.showImgLoading("已复制到剪贴板",1);
          //alert("已复制到剪贴板");
        },
        (reject: string) => {
          this.popSerProvider.showImgLoading("复制失败",1);
          
        }
      );

    
  }


  //物业开锁
  public  adminUnlock(){
    this.verifyCode1.disable = false;
    //机子返回的是16进制	
    
      //厂商+项目代码 转字节
      var crc =this.appconfig.CRC16(this.crc16);

      //获取时间	
      var time = Math.round(new Date().getTime()/1000)-946656000+85800;
      //var time = 1551674400-946656000;



          
          //低位在前 下标从0开始,  高位在前 下标从尾部开始,

      var data =  this.intToBytes(time);
      
     

      var  str = [];
      if(localStorage.getItem("nav")!=undefined && localStorage.getItem("nav")!=null && localStorage.getItem("nav")!="" ){
        if(localStorage.getItem("status") =='true'){
          str = [0xB4,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]];  
        }else{
          str = [0xB5,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]];
        }
        
      }else{
        var icodeArray = new Array(5);   //用户编码
        icodeArray[0] ="0x"+this.userCode.substr(6,2);
        icodeArray[1] ="0x"+this.userCode.substr(8,2);
        icodeArray[2] ="0x01";
        icodeArray[3] ="0x"+this.userCode.substr(10,2);
        icodeArray[4] ="0x"+this.userCode.substr(12,2);  
        if(localStorage.getItem("status") =='true'){

          

          str = [0xB3,crc[1],crc[0],parseInt(icodeArray[0],16),parseInt(icodeArray[1],16),parseInt(icodeArray[2],16),parseInt(icodeArray[3],16),parseInt(icodeArray[4],16),data[3],data[2],data[1],data[0]];  
        }else{
          str = [0xB3,crc[1],crc[0],parseInt(icodeArray[0],16),parseInt(icodeArray[1],16),parseInt(icodeArray[2],16),parseInt(icodeArray[3],16),parseInt(icodeArray[4],16),data[3],data[2],data[1],data[0]];
        }
        
      }

      // alert(str);
      // console.log(str);
      
      //var fileName='authUser.wav';
     
      console.log("[cloudshare] code"+str); 
      //var str1  = this.appconfig.soundFile(str); 
     
      this.httpSerProvider.post('/home/upload',str).then((data:any)=>{
        if(data.code==='0000'){
          this.loading = "生成秘钥成功";
          this.popSerProvider.showImgLoading("生成秘钥成功",1);
          //alert("已复制到剪贴板");
          this.fileDownload= APP_FILE_URL+data.data;
         
        }else if(data.code==='9999'){
          this.popSerProvider.toast(data.message);
        }else{
          this.popSerProvider.toast(data.message);
          
        }
        this.verifyCode1.countdown  = 1;
        this.verifyCode1.disable = true;
       
      });
      
      // this.file.writeExistingFile(this.fileUrl,fileName,str1).then(response => {
      //   if (this.platform.is('ios')) {
      //     this.recordData = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+fileName);
      //   } else if (!this.platform.is('ios')) {
      //     this.recordData = this.media.create(this.fileUrl+fileName);  
      //   }
   
      //         this.recordData.play();
      //         this.recordData.onSuccess.subscribe(() => this.isCheck = true,this.isCheck = true,this.popSerProvider.showSoundLoading("播放中...",3)); 
              
              
      // }).catch(error => {
      //   this.isCheck = false;
      // })
     

    }


}
