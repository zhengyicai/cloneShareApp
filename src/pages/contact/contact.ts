import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
  }

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
  ionViewDidLoad() {
      
      this.loadData();
    // setTimeout(() => {

    //    alert("fuck");
    // }, 4000);

  }

  public loadData(){

    var csCode = 0;  //厂商代码
    var areaCode= "1193046";  //项目代码
    this.areaCode=areaCode;
    var equCode= "000002010101";  //设备编码
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

  public  BytesToint(src:any){ 
    var nValue;
    var nValue0 = src[0];
    var nValue1 = src[1];
    var nValue2 = src[2];
    var nValue3 = src[3];
    nValue = nValue0 | nValue1<< 8 | nValue2 << 16 | nValue3 << 24;

    return nValue; 

  }

  //播放序列号
  public playEquCode(code){
      var str = [0x18,parseInt("0x"+code)];
      console.log(str);
      var fileName='playequ.wav';
     
      var str1  = this.appconfig.sound(str); 

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
  

  //物业开锁
  public  adminUnlock(){
      //机子返回的是16进制	
   
    
    // console.log(crc16[0]+"a"+crc16[1]+"a"+crc16[2]+"a"+crc16[3]+"a"+crc16[4]);
		//var crc16 = [0x00,0x00,0x12,0x34,0x56];
		//厂商+项目代码 转字节
		var crc =this.appconfig.CRC16(this.crc16);

		//获取时间	
		var time = Math.round(new Date().getTime()/1000)-946656000;

        
        //低位在前 下标从0开始,  高位在前 下标从尾部开始,

		var data =  this.intToBytes(time);
		
		
		//var str = [0x56,0x00,0x00,0xFF,0xFF,0xFF];
		var str = [0xB5,crc[1],crc[0],this.equArray[0],this.equArray[1],this.equArray[2],this.equArray[3],this.equArray[4],data[3],data[2],data[1],data[0]];
		
		var fileName='lock.wav';
       
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


  //设置项目
  public setArea(){
   
    //设置项目代码
    var setCode =this.areaCode;
    var arealist =  this.intToBytes(parseInt(setCode));
    var icode = this.icodeArray;

    //设备
    var str = [0xA7,0x00,icode[0],icode[1],icode[2],icode[3],icode[4],icode[5],arealist[2],arealist[1],arealist[0]];
    var fileName='area.wav';
       
	   var str1  = this.appconfig.sound(str); 
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

  //设置设备编码
  public setEquAlert(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置设备编码');

        alert.addInput({
        type: 'radio',
        label: 'test'+'('+"000002040303"+')',
        value: '000002040303',
        checked: true
        });

        alert.addInput({
        type: 'radio',
        label: 'test'+'('+"000002040302"+')',
        value: '000002040302'
        });

        alert.addInput({
        type: 'radio',
        label: 'test'+'('+"000002040305"+')',
        value: '000002040305'
        });

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {
            console.log('Radio data:', data);
            this.equCode = data;
            this.setEqu(data);
            this.loadData();
        }
        });

        alert.present();
  }

  //设置设备
  public setEqu(data){
   
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


  //设置时间
  public  updateTime(){ 
    
		var time = Math.round(new Date().getTime()/1000)-946656000;
		var data =  this.intToBytes(time);
		
	
		//设备
		var str = [0xA7,0x03,this.crc16[0],this.crc16[1],this.crc16[2],this.crc16[3],this.crc16[4],data[3],data[2],data[1],data[0]];
		
		var fileName='time.wav';
       
	   var str1  = this.appconfig.sound(str); 
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
    
  public autoSet(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置设备编码');

        alert.addInput({
        type: 'radio',
        label: 'test'+'('+"000002040303"+')',
        value: '000002040303',
        checked: true
        });

        alert.addInput({
        type: 'radio',
        label: 'test'+'('+"000002040302"+')',
        value: '000002040302'
        });

        alert.addInput({
        type: 'radio',
        label: 'test'+'('+"000002040305"+')',
        value: '000002040305'
        });

     

        alert.addButton('返回');
        alert.addButton({
        text: '确定',
        handler: (data: any) => {
            
              this.setArea();
              
          
              
              var  two =  setInterval(() => {
                this.updateTime();
                clearInterval(two);
              }, 3000);

              var  one =  setInterval(() => {
                this.setEqu(data);
                clearInterval(one);
              }, 6000);
           
           

        }
        });

        alert.present();  
  }  
}
