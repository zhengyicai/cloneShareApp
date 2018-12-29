import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform,Events } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';



declare var _this:any;
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor( public popSerProvider:PopSerProvider,private events: Events,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
    
    
  }

  static play1:any;
  public appconfig:any;
  public filePath : any; //录音文件的名字
  public recordData : any; //录音对象

  csArray:any = new Array(2); //厂商代码byte两位
  areaArray:any = new Array(3); //项目代码byte三位
  equArray:any = new Array(5); //设备代码byte三位
  crc16:any = new Array(5);

  icodeArray= new Array(6); //序列号
  playDisable:boolean = true; //是否禁用  true:开启，false:禁用

  areaCode:any="";

  equCode:any= "";  //设备编码
  fileUrl:any;  //文件存放地址 

  setEquCode:any =[]; //设置项目代码list

  ionViewDidLoad() {
      this.playDisable = true;
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

    this.events.subscribe('test1', () => {
      this.playDisable = true;
    });


  }



  public loadData(){

    var option = JSON.parse(localStorage.getItem("communityData")); 
      

    var csCode = option.csCode;  //厂商代码   10进制
    var areaCode= option.areaCode;  //项目代码   10进制
    
    this.setEquCode=option.equList;
    this.areaCode=areaCode;
    

    //厂商byte
    var cslist = this.intToBytes(csCode);
    this.csArray[0] = cslist[0];
    this.csArray[1] = cslist[1];

   
   //项目byte
    var arealist =  this.intToBytes(parseInt(areaCode));
    this.areaArray[0]=arealist[0];
    this.areaArray[1]=arealist[1];
    this.areaArray[2]=arealist[2];


   
  

    console.log("csArray"+ this.csArray);  
    console.log("areaArray"+ this.areaArray);  

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

  public  BytesToint(src:any){ 
    var nValue;
    var nValue0 = src[0];
    var nValue1 = src[1];
    var nValue2 = src[2];
    var nValue3 = src[3];
    nValue = nValue0 | nValue1<< 8 | nValue2 << 16 | nValue3 << 24;

    return nValue; 

  }
  public test(){
    alert(_this);
    
    
   
   
   }

  //播放序列号
  public playEquCode(code){
    let that=this; 
    this.playDisable = false;
      var str = [0x18,parseInt("0x"+code)];
      console.log(str);
      var fileName='playequ'+code+'.wav';
     
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
        this.recordData.setVolume(1);
              this.recordData.play();
              //完成回调功能
              this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",1),
              //this.file.removeFile(this.fileUrl,fileName)
              ); 
              //this.recordData.onStatusUpdate.subscribe(status => this.playDisable = true,this.playDisable = true
              // fires when file status changes  
              //that.playDisable = true,    
             // this.events.publish('test1')
             
              
               
                
              // ); 
      }).catch(error => {
            this.playDisable = true;
      })
  }


  

  //物业开锁
  public  adminUnlock(){
      //机子返回的是16进制	
   
      this.playDisable = false;
    // console.log(crc16[0]+"a"+crc16[1]+"a"+crc16[2]+"a"+crc16[3]+"a"+crc16[4]);
		//var crc16 = [0x00,0x00,0x12,0x34,0x56];
		//厂商+项目代码 转字节
		var crc =this.appconfig.CRC16(this.crc16);

		//获取时间	
		var time = Math.round(new Date().getTime()/1000)-946656000;

        
        //低位在前 下标从0开始,  高位在前 下标从尾部开始,

		var data =  this.intToBytes(time);
		
		
		//var str = [0x56,0x00,0x00,0xFF,0xFF,0xFF];
    //var str = [0xB5,crc[1],crc[0],this.equArray[0],this.equArray[1],this.equArray[2],this.equArray[3],this.equArray[4],data[3],data[2],data[1],data[0]];
    var str = []; 
    if(localStorage.getItem("status") =='true'){
      str =  [0xB4,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]];
    }else{
     str =  [0xB5,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]];
    }
		
		var fileName='lock.wav';
       
	   var str1  = this.appconfig.sound(str); 
	   //alert(str);
	   //console.log(str1);
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
            this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",2),this.file.removeFile(this.fileUrl,fileName)); 
		}).catch(error => {
      this.playDisable = true;

		})

  }


  //设置项目代码
  public setAreaAlert(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置项目代码');


        for(var i = 0 ;i<this.setEquCode.length;i++){
          if(i==0){
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equipmentId+')',
              value: this.setEquCode[i].equId,
              checked: true
              });
          }else{
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equipmentId+')',
              value: this.setEquCode[i].equId
              });
          }
          

        }
       

        // alert.addInput({
        // type: 'radio',
        // label: 'test'+'('+"000002040302"+')',
        // value: '000002040302'
        // });

        // alert.addInput({
        // type: 'radio',
        // label: 'test'+'('+"000002040305"+')',
        // value: '000002040305'
        // });

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {
            console.log('Radio data:', data);
            this.equCode = data;
            this.setArea(data);
            
        }
        });

        alert.present();
  }





  //设置项目
  public setArea(data){

    //this.playDisable = false;
   
    //设置项目代码
    var setCode =this.areaCode;
    var arealist =  this.intToBytes(parseInt(setCode));

    var icodeArray = new Array(6);  
    //序列号
     icodeArray[0] ="0x"+data.substr(0,2);
     icodeArray[1] ="0x"+data.substr(2,2);
     icodeArray[2] ="0x"+data.substr(4,2);
     icodeArray[3] ="0x"+data.substr(6,2);
     icodeArray[4] ="0x"+data.substr(8,2);
     icodeArray[5] ="0x"+data.substr(10,2);

    

     

    //设备
    var str = [0xA7,0x00,icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],icodeArray[5],arealist[2],arealist[1],arealist[0]];
    var fileName='area.wav';
       
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
            this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",2),this.file.removeFile(this.fileUrl,fileName)); 
            
		}).catch(error => {
      this.playDisable = true;
		})
  }

  //设置设备编码
  public setEquAlert(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置设备编码');

        for(var i = 0 ;i<this.setEquCode.length;i++){
          if(i==0){
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equipmentId+')',
              value: this.setEquCode[i].equipmentId,
              checked: true
              });
          }else{
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equipmentId+')',
              value: this.setEquCode[i].equipmentId
              });
          }
          

        }
   

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {
            console.log('Radio data:', data);
            this.equCode = data;
            this.setEqu(data);
            // this.loadData();
        }
        });

        alert.present();
  }


  //设置一键删除
  public setCardRemove(){
    let alert = this.alertCtrl.create();
    alert.setTitle('一键删除门禁卡号');

        for(var i = 0 ;i<this.setEquCode.length;i++){
          if(i==0){
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equId+')',
              value: this.setEquCode[i].equId,
              checked: true
              });
          }else{
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equId+')',
              value: this.setEquCode[i].equId
              });
          }
          

        }
   

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {
            this.removeCard(data);
        }
        });

        alert.present();
  }
  //一键设置删除
  public removeCard(data){
    this.playDisable = false;
   
    var icodeArray = new Array(6);  
    //序列号
     icodeArray[0] ="0x"+data.substr(0,2);
     icodeArray[1] ="0x"+data.substr(2,2);
     icodeArray[2] ="0x"+data.substr(4,2);
     icodeArray[3] ="0x"+data.substr(6,2);
     icodeArray[4] ="0x"+data.substr(8,2);
     icodeArray[5] ="0x"+data.substr(10,2);
    
    //设备
    var str = [0xA7,0x04,icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],icodeArray[5],0x00,0x00,0x00];
    var fileName='removeCard.wav';
       
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
            this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",2),this.file.removeFile(this.fileUrl,fileName)); 
		}).catch(error => {
      this.playDisable = true;
		})  
    
  }


  //设置设备
  public setEqu(data){
    this.playDisable = false;
    var setequ = data;
    var setEqu  = new Array(5);
    setEqu[0] = parseInt(setequ.substr(6,2));
    setEqu[1] = parseInt(setequ.substr(8,2));
    setEqu[2] = parseInt(setequ.substr(10,2));
    setEqu[3] = 0;
    setEqu[4] = 0;
    



    //设备
    var str = [0xB7,0x01,this.csArray[1],this.csArray[0],this.areaArray[2],this.areaArray[1],this.areaArray[0],setEqu[0],setEqu[1],setEqu[2],setEqu[3],setEqu[4]];
    var fileName='equ.wav';
       
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
            this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",2),this.file.removeFile(this.fileUrl,fileName)); 
		}).catch(error => {
      this.playDisable = true;
		})
  }


   //设置用户识别编码alert
   public setUserMaskAlert(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置用户识别码');

        alert.addInput({
        type: 'radio',
        label: 'FFFFFFFF00',
        value: 'FFFFFFFF00',
        checked: true
        });

        alert.addInput({
        type: 'radio',
        label: 'FFFFFF0000',
        value: 'FFFFFF0000'
        });

        alert.addInput({
        type: 'radio',
        label: 'FFFF000000',
        value: 'FFFF000000'
        });

        alert.addInput({
        type: 'radio',
        label: '0000000000',
        value: '0000000000'
        });

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {
            console.log('Radio data:', data);
            this.setUserMask(data);
            this.loadData();
        }
        });

        alert.present();
  }


  //设置用户识别码
  public  setUserMask(data){
    this.playDisable = false;
    var setUserCode = data;  
    //var setUserCode = "FFFFFF0000";
      var setUser  = new Array(5);
      setUser[0] = parseInt("0x"+setUserCode.substr(0,2));
      setUser[1] = parseInt("0x"+setUserCode.substr(2,2));
      setUser[2] = parseInt("0x"+setUserCode.substr(4,2));
      setUser[3] = parseInt("0x"+setUserCode.substr(6,2));
      setUser[4] =parseInt("0x"+setUserCode.substr(8,2));
      console.log("setUser"+setUser);

      //用户识别码
    var str = [0xB7,0x02,this.csArray[1],this.csArray[0],this.areaArray[2],this.areaArray[1],this.areaArray[0],setUser[0],setUser[1],setUser[2],setUser[3],setUser[4]];
    var fileName='user.wav';
       
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
        this.recordData.setVolume(1);
              this.recordData.play();
              this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",2),this.file.removeFile(this.fileUrl,fileName)); 
      }).catch(error => {
        this.playDisable = true;
      })


  }


  //设置时间
  public  updateTime(){ 
    this.playDisable = false;
		var time = Math.round(new Date().getTime()/1000)-946656000;
		var data =  this.intToBytes(time);
		
	
		//设备
		var str = [0xA7,0x03,this.crc16[0],this.crc16[1],this.crc16[2],this.crc16[3],this.crc16[4],data[3],data[2],data[1],data[0]];
		
		var fileName='time.wav';
       
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
            this.recordData.onSuccess.subscribe(() =>this.playDisable = true,this.playDisable = true,this.popSerProvider.showSoundLoading("播放中...",2),this.file.removeFile(this.fileUrl,fileName)); 
		}).catch(error => {
      this.playDisable = true;
		})
    }
    
  public autoSet(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置设备编码');

        for(var i = 0 ;i<this.setEquCode.length;i++){
          if(i==0){
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equipmentId+')',
              value: this.setEquCode[i].equId+"&sb"+this.setEquCode[i].equipmentId+"&sb"+this.setEquCode[i].equCode,
              checked: true
              });
          }else{
            alert.addInput({
              type: 'radio',
              label: this.setEquCode[i].equipmentName+'('+this.setEquCode[i].equipmentId+')',
              value: this.setEquCode[i].equId+"&sb"+this.setEquCode[i].equipmentId+"&sb"+this.setEquCode[i].equCode
              });
          }
          

        }

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {

              var str = data.split("&sb");
            
              this.setArea(str[0]);
              
          
              
              var  two =  setInterval(() => {
                this.updateTime();
                clearInterval(two);
              }, 3000);

              var  one =  setInterval(() => {
                this.setEqu(str[1]);
                clearInterval(one);
              }, 6000);

              var  three =  setInterval(() => {
                this.setUserMask(str[2]);
                clearInterval(three);
              }, 9000);


            //  this.(data);
           
           

        }
        });

        alert.present();  
  }  


   public addCard(){
    this.navCtrl.push("AddCardPage");
   } 
}
