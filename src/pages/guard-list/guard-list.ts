import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';

/**
 * Generated class for the GuardListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guard-list',
  templateUrl: 'guard-list.html',
})

export class GuardListPage {

  constructor(private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
	this.appconfig = new AppConfig();
}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad GuardListPage');
  }
  public appconfig:any;
  public filePath : any; //录音文件的名字
  public recordData : any; //录音对象
  

  startReocrd(){  //开始录音

      //文件URL，文件存放在拓展内存卡中文件夹下，命名为Record.mp3
      this.filePath = this.file.externalDataDirectory + "Record.mp3";

      //创建media对象，参数文件名字，上面的filePath也指定了文件存放位置和文件名字
      this.recordData = this.media.create(this.filePath);

      //开始录音
      //this.recordData.startRecord();
      this.doRecord_Media(this.recordData);
  }

  doRecord_Media(mediaObj: MediaObject) {
    // 开始录音
    mediaObj.startRecord();

    // 监测录音状态的回调
    mediaObj.onStatusUpdate.subscribe(status => this.showRecordStatus(status));

    
    // 录音失败后的处理，如提示错误码
    mediaObj.onError.subscribe(error => alert('Record fail! Error: ' + error));

    // 设置录音的长度，单位毫秒，ios / android 均有效
    window.setTimeout(() => mediaObj.stopRecord(), 10 * 1000);
}
// 根据录音状态码返回录音状态的方法
showRecordStatus(status) {
  var statusStr = "";
  switch (status) {
      case 0:
          statusStr = "None";
          break;
      case 1:
          statusStr = "Start";
          break;
      case 2:
          statusStr = "Running";
          break;
      case 3:
          statusStr = "Paused";
          break;
      case 4:
          statusStr = "Stopped";
          break;
      default:
          statusStr = "None";
  }
  alert("status: " + statusStr);
}


  pauseRecord(){   

      //暂停录音
      this.recordData.pauseRecord();

  }

  play(){   

      //播放录音
      this.recordData.play();

  }

  resumeRecord(){   

      //继续播放录音
      this.recordData.resumeRecord();

  }

  stopRecord(){   

      //停止结束录音
      this.recordData.stopRecord();

  }


  //写入文件
  startWrite(){
        this.file.createFile( this.file.externalDataDirectory,"test.txt",true);
        this.file.writeExistingFile(this.file.externalDataDirectory,"test.txt",new Date()+"");
        alert("ok");
    
  }

   download() {
   
       //var object = this.file.createFile( this.file.externalDataDirectory,"test.txt",false);
      var str = [0x18,0x04];
      //var str = [0xA7,0x3,0x0,0x1,,0x0,0x0,];

       

       var fileName='str6.wav';
       
	   var str1  = this.appconfig.sound(str); 

	   alert(str1);
	   console.log(str1);
	   this.file.createFile( this.file.externalDataDirectory,fileName,true);
	   
	   //设置回调函数， 不然play()的速度快于write的速度，会获取到上一次的数据
	   this.file.writeExistingFile(this.file.externalDataDirectory,fileName,str1).then(response => {
			this.recordData = this.media.create(this.file.externalDataDirectory+fileName);
			//控制声音大小 0-1
			this.recordData.setVolume(0.1);
            this.recordData.play();
		}).catch(error => {

		})
 
	}

	public  intToBytes(value:any){ 
	
		var src = new Array(4);
		src[3] =  ((value>>24) & 0xFF);
		src[2] =  ((value>>16) & 0xFF);
		src[1] =  ((value>>8) & 0xFF);  
		src[0] =  (value & 0xFF);				
		return src; 

	}

	

	public  setTime(){ 

		
	

		//机子返回的是16进制	
		var crc16 = [0x00,0x00,0x12,0x34,0x56];
		//var crc16 = [0x00,0x00,0x00,0x00,0x01];
		
		//厂商+项目代码 转字节
		var crc =this.appconfig.CRC16(crc16);

		//获取时间	
		var time = Math.round(new Date().getTime()/1000)-946656000;

        
        //低位在前 下标从0开始,  高位在前 下标从尾部开始,

		var data =  this.intToBytes(time);
		
		
		//var str = [0x56,0x00,0x00,0xFF,0xFF,0xFF];
		var str = [0xB3,crc[1],crc[0],0x01,0x01,0x01,0x10,0x08,data[3],data[2],data[1],data[0]];
		
		var fileName='str6.wav';
       
	   var str1  = this.appconfig.sound(str); 
	   //alert(str);
	   //console.log(str1);
	   this.file.createFile( this.file.externalDataDirectory,fileName,true);
	   
	   //设置回调函数， 不然play()的速度快于write的速度，会获取到上一次的数据
	   this.file.writeExistingFile(this.file.externalDataDirectory,fileName,str1).then(response => {
			this.recordData = this.media.create(this.file.externalDataDirectory+fileName);
			//控制声音大小 0-1
			this.recordData.setVolume(0.1);
            this.recordData.play();
		}).catch(error => {

		})
	}

	public  updateTime(){ 

	

		var crc16 = [0x00,0x00,0x12,0x34,0x56];
		//var crc16 = [0x00,0x00,0x00,0x00,0x01];
		
		var crc =this.appconfig.CRC16(crc16);


		var time = Math.round(new Date().getTime()/1000)-946656000;
		var data =  this.intToBytes(time);
		
		alert("time"+time);

		//var str = [0x56,0x00,0x00,0xFF,0xFF,0xFF];
		//var str = [0xB3,crc[1],crc[0],0x01,0x01,0x01,0x10,0x08,data[3],data[2],data[1],data[0]];

		//设备
		var str = [0xA7,0x03,0x00,0x00,0x12,0x34,0x56,data[3],data[2],data[1],data[0]];
		
		var fileName='str6.wav';
       
	   var str1  = this.appconfig.sound(str); 
	   //alert(str);
	   //console.log(str1);
	   this.file.createFile( this.file.externalDataDirectory,fileName,true);
	   
	   //设置回调函数， 不然play()的速度快于write的速度，会获取到上一次的数据
	   this.file.writeExistingFile(this.file.externalDataDirectory,fileName,str1).then(response => {
			this.recordData = this.media.create(this.file.externalDataDirectory+fileName);
			//控制声音大小 0-1
			this.recordData.setVolume(0.1);
            this.recordData.play();
		}).catch(error => {

		})
	}


  
    
    

 
}
