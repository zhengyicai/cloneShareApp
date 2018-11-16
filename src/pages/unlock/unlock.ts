import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform, Thumbnail } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
/**
 * Generated class for the UnlockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockPage {

  constructor(public popSerProvider:PopSerProvider,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
  }


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

    this.adminUnlock();

    


  }

  public loadData(){

    var csCode = 0;  //厂商代码
    var areaCode= "1193046";  //项目代码
    this.areaCode=areaCode;
    var equCode= "000002040303";  //设备编码
    this.equCode = equCode;
    var  icode= "00005B7B426F"  //系列序列号 8位字符串   000032A6D274

    //厂商byte
    var cslist = this.intToBytes(csCode);
    this.csArray[0] = cslist[0];
    this.csArray[1] = cslist[1];

   
   //项目byte
    var arealist =  this.intToBytes(parseInt(areaCode));
    this.areaArray[0]=arealist[0];
    this.areaArray[1]=arealist[1];
    this.areaArray[2]=arealist[2];

    //设备编号
    
   
   
    this.equArray[0] = parseInt(equCode.substr(6,2));
    this.equArray[1] = parseInt(equCode.substr(8,2));
    this.equArray[2] = parseInt(equCode.substr(10,2));
    this.equArray[3] = 0;
    this.equArray[4] = 0;

  

    console.log("csArray"+ this.csArray);  
    console.log("areaArray"+ this.areaArray);  

    //小区不进行转换，直接获取两位的数据,不够补零
    console.log("equArray"+  this.equArray);  

   
    this.crc16[0] =  this.csArray[1];
    this.crc16[1] =  this.csArray[0];
    this.crc16[2] =  this.areaArray[2];
    this.crc16[3] =  this.areaArray[1];
    this.crc16[4] =  this.areaArray[0];


    
    //序列号
    this.icodeArray[0] ="0x"+icode.substr(0,2);
    this.icodeArray[1] ="0x"+icode.substr(2,2);
    this.icodeArray[2] ="0x"+icode.substr(4,2);
    this.icodeArray[3] ="0x"+icode.substr(6,2);
    this.icodeArray[4] ="0x"+icode.substr(8,2);
    this.icodeArray[5] ="0x"+icode.substr(10,2);
  }

  public  intToBytes(value:any){ 
	
		var src = new Array(4);
		src[3] =  ((value>>24) & 0xFF);
		src[2] =  ((value>>16) & 0xFF);
		src[1] =  ((value>>8) & 0xFF);  
		src[0] =  (value & 0xFF);				
		return src; 

  }

  //物业开锁
  public  adminUnlock(){
    //机子返回的是16进制	
    
      //厂商+项目代码 转字节
      var crc =this.appconfig.CRC16(this.crc16);

      //获取时间	
      var time = Math.round(new Date().getTime()/1000)-946656000;

          
          //低位在前 下标从0开始,  高位在前 下标从尾部开始,

      var data =  this.intToBytes(time);
      
      
      
      
      var str = [0xB5,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]];
      var fileName='userlock.wav';
     
        
      var str1  = this.appconfig.sound(str); 
      
      this.file.createFile( this.fileUrl,fileName,true);
      
      //设置回调函数， 不然play()的速度快于write的速度，会获取到上一次的数据
      this.file.writeExistingFile(this.fileUrl,fileName,str1).then(response => {
        if (this.platform.is('ios')) {
          this.recordData = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+fileName);
        } else if (!this.platform.is('ios')) {
          this.recordData = this.media.create(this.fileUrl+fileName);  
        }
        //控制声音大小 0-1
      //this.recordData.setVolume(1);
              this.recordData.play();

              //完成回调功能
              this.recordData.onSuccess.subscribe(() => this.isCheck = true,this.isCheck = true,this.popSerProvider.showSoundLoading("播放中...",2)); 
              
              
      }).catch(error => {
        this.isCheck = false;
      })
     

    }


  
 
}
