import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform, Thumbnail,App } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { MediaCapture, MediaFile, CaptureError, CaptureAudioOptions } from '@ionic-native/media-capture';
/**
 * Generated class for the AddCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-card',
  templateUrl: 'add-card.html',
})
export class AddCardPage {

  constructor(public mediaCapture: MediaCapture,private appCtrl: App,public popSerProvider:PopSerProvider,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
     // var option =  localStorage.getItem("cardData");
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
  userCode:any = "";
  equCode:any= "";  //设备编码
  fileUrl:any;  //文件存放地址 



  subData:any = {
    communityId:"",
    unitId:"",
    buildingId:"",
    roomName:"",
    remark:"",
    isTrue:"20"
  }

  addBankDefaultState:any =false; //是否默认

  citylist:any = [];  //小区
  buildList:any = []; //楼栋
  unitList:any = []; //单元
  roomList:any = [];


  listData = [];
  listDatatest:any = new Array(3);
  truePwd:any ="";
  area:any ="";
  isTrue:any = true;

  cardNumber:any = 0;
  ionViewDidLoad() {
        var option =  JSON.parse(localStorage.getItem("cardData"));
        
        this.buildList = option;

        if (this.platform.is('ios')) {
          this.fileUrl = this.file.tempDirectory;
        //alert(this.fileUrl);
        } else if (!this.platform.is('ios')) {
          this.fileUrl = this.file.externalDataDirectory;  
        }      
     

        this.loadData();
  }

  findUnit(){
        this.unitList = [];
        for(var i = 0 ;i<this.buildList.length;i++){
            if(this.subData.buildingId == this.buildList[i].id){
                  this.unitList = this.buildList[i].children; 
            }
      }
  }
  gotoAddCard(){

      if(this.validator()){
        this.isTrue = false;
        this.roomList = [];
        for(var i = 0;i<this.unitList.length;i++){
          if(this.subData.unitId == this.unitList[i].id){
                this.roomList = this.unitList[i].children;
          }
        }
        this.setCardId();
      }
      
  }
  public setCardId(){
        //this.popSerProvider.toast(this.roomList[this.cardNumber].label+","+this.roomList[this.cardNumber].value);
        this.adminUnlock(this.roomList[this.cardNumber].label,this.roomList[this.cardNumber].value);
        if(this.cardNumber<this.roomList.length-1){
            this.cardNumber++;
            setTimeout(() => {
              this.setCardId();
            }, 6000);
        }else{
          this.cardNumber=0;
          this.isTrue  = true;
        }

  }


  public test(){
    console.log("aaa");
  }

  public loadData(){
    var option = JSON.parse(localStorage.getItem("communityData"));   
    var csCode = option.csCode;  //厂商代码   10进制
    var areaCode= option.areaCode;  //项目代码   10进制
    this.areaCode=areaCode;
    this.userCode = option.roomId; //
   


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

  //卡号设置
  public  adminUnlock(userCodeStr,cardCodeStr){
    //机子返回的是16进制	
    
      //厂商+项目代码 转字节
      var crc =this.appconfig.CRC16(this.crc16);

      //获取时间	
      var time = Math.round(new Date("2099/12/31 23:59:59").getTime()/1000)-946656000;

          
          //低位在前 下标从0开始,  高位在前 下标从尾部开始,

      var data =  this.intToBytes(time);
      
     

      var  str = [];
     
      var icodeArray = new Array(5);   //用户编码
      icodeArray[0] ="0x"+userCodeStr.substr(6,2);
      icodeArray[1] ="0x"+userCodeStr.substr(8,2);
      icodeArray[2] ="0x01";
      icodeArray[3] ="0x"+userCodeStr.substr(10,2);
      icodeArray[4] ="0x"+userCodeStr.substr(12,2);  

      
      var cardNo =  this.intToBytes(parseInt(cardCodeStr));

      //alert(userCodeStr+","+cardCodeStr);
      str = [0xE7,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],data[3],data[2],data[1],data[0],cardNo[2],cardNo[1],cardNo[0]];  
     
      // str = [0xB5,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]]; 
     
    
      //var fileName=this.subData.unitId+'.wav';
      var fileName=userCodeStr+'card.wav';
     
        
      var str1  = this.appconfig.sound(str); 
      // console.log(str1);
      this.file.createFile( this.fileUrl,fileName,true);
      
     
      this.file.writeExistingFile(this.fileUrl,fileName,str1).then(response => {
     
        if (this.platform.is('ios')) {
          this.recordData = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+fileName);
        } else if (!this.platform.is('ios')) {
          this.recordData = this.media.create(this.fileUrl+fileName);  
        }

       
              this.recordData.play();
              this.recordData.onSuccess.subscribe(() => 
                  this.isCheck = true,this.isCheck = true,this.popSerProvider.showSoundLoading("播放中...",3),
                  this.file.removeFile(this.fileUrl,fileName)
              ); 
              
              
      }).catch(error => {
        this.isCheck = false;
      })
     

    }


    //验证
  validator() {

  

    if (this.subData.buildingId == null || this.subData.buildingId == '') {
      this.popSerProvider.toast("楼栋不能为空");
      return false;
    }

    if (this.subData.unitId == null || this.subData.unitId == '') {
        this.popSerProvider.toast("单元不能为空");
        return false;
    }




    return true;
  }




}
