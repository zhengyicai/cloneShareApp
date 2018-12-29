import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform, Thumbnail,App } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import { SoundDecodePage } from '../sound-decode/sound-decode';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { MediaCapture, MediaFile, CaptureError, CaptureAudioOptions } from '@ionic-native/media-capture';
/**
 * Generated class for the UnlockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var audioinput: any;
@IonicPage()
@Component({
  selector: 'page-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockPage {

  constructor(public mediaCapture: MediaCapture,private appCtrl: App,public popSerProvider:PopSerProvider,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
  }


  isCheck:boolean =false;   //控制打开 true:success false:unsuccess
  public appconfig:any;
  public filePath : any; //录音文件的名字
  public recordData : any; //录音对象
  public recordData1:any; //录音对象2
  public recordData2 : any; //录音对象3
  csArray:any = new Array(2); //厂商代码byte两位
  areaArray:any = new Array(3); //项目代码byte三位
  equArray:any = new Array(5); //设备代码byte三位
  crc16:any = new Array(5);

  icodeArray= new Array(6); //序列号

  areaCode:any="";
  userCode:any = "";
  equCode:any= "";  //设备编码
  fileUrl:any;  //文件存放地址 
  test:any;
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

  //物业开锁
  public  adminUnlock(){
    this.buf11 ="";
    console.log("adminUnlock  start[cloudshare]");
    //this.file.removeFile(this.fileUrl,"Record.wav");  
    this.countNum = 0;
    //机子返回的是16进制	
    
      //厂商+项目代码 转字节
      var crc =this.appconfig.CRC16(this.crc16);

      //获取时间	
      var time = Math.round(new Date().getTime()/1000)-946656000;

          
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
          str = [0xB0,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],data[3],data[2],data[1],data[0]];  
        }else{
          str = [0xB1,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],data[3],data[2],data[1],data[0]];
        }
        
      }

      // alert(str);
      // console.log(str);
      
      var fileName='userlock.wav';
     
        
      var str1  = this.appconfig.sound(str); 
      
      this.file.createFile( this.fileUrl,fileName,true);
      

      //let options:WriteOptions = {};
    
    
      this.file.writeExistingFile(this.fileUrl,fileName,str1).then(response => {
    
      // this.startRecording_MediaCapture();
        if (this.platform.is('ios')) {
          this.recordData = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+fileName);
          this.recordData.play();
          window.setTimeout(() => this.stopRecord(), 3000);
       
           this.recordData.onSuccess.subscribe(() => 
             this.startReocrd(),
             this.isCheck = true,this.isCheck = true,
             
             this.popSerProvider.showSoundLoading("播放中...",3),
             this.file.removeFile(this.fileUrl,fileName),
             window.setTimeout(() =>this.recordData.release(), 2000),
              

           
           ); 
        } else if (!this.platform.is('ios')) {
          this.recordData = this.media.create(this.fileUrl+fileName);  
          this.recordData.play();
          
          
          var captureCfg = {
            sampleRate: audioinput.SAMPLERATE.CD_AUDIO_44100Hz,
            bufferSize: 16384,
            channels: audioinput.CHANNELS.MONO,
            format: audioinput.FORMAT.PCM_16BIT,
            normalize: true,
            normalizationFactor: 32767.0,
            streamToWebAudio: false,
            audioContext: null,
            concatenateMaxChunks: 10,
            audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT,
            fileUrl: this.fileUrl+ "Record.wav"
            
            };
           
          
           audioinput.start(captureCfg); 
           
           window.setTimeout(() => this.stopRecord(), 2000);


           this.recordData.onSuccess.subscribe(() => 
                  this.isCheck = true,this.isCheck = true,
             //     this.popSerProvider.showSoundLoading("播放中...",1),
                  
                  //2018-12-27 18:06
                  //this.file.removeFile(this.fileUrl,fileName),
                  
                  this.popSerProvider.showSoundLoading("播放中...",2),
                  window.setTimeout(() =>this.recordData.release(), 2000),
              ); 
              


        }
   
             
             // this.startReocrd();
              //this.startReocrd();



             
              
              
      }).catch(error => {
        this.isCheck = false;
      })
     

    }


    //物业开锁
  public  adminUnlock2(){
   // this.file.removeFile(this.fileUrl,"Record.wav");  
   
    //机子返回的是16进制	
      this.countNum = 1;
      //机子返回的是16进制	
      
        //厂商+项目代码 转字节
        var crc =this.appconfig.CRC16(this.crc16);
  
        //获取时间	
        var time = Math.round(new Date().getTime()/1000)-946656000;
  
            
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
            str = [0xB0,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],data[3],data[2],data[1],data[0]];  
          }else{
            str = [0xB1,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],data[3],data[2],data[1],data[0]];
          }
          
        }
  
        // alert(str);
      
        
        var fileName='userlock.wav';
       
          
        var str1  = this.appconfig.sound(str); 
        
        //this.file.createFile( this.fileUrl,fileName,true);
        
        
      



        
        
        // this.file.writeFile(this.fileUrl,fileName,str1,{}).then(response => {
      
          if (this.platform.is('ios')) {
            this.recordData = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+fileName);
            this.recordData.play();
            window.setTimeout(() => this.stopRecord(), 3000);
         
             this.recordData.onSuccess.subscribe(() => 
               this.startReocrd(),
               this.isCheck = true,this.isCheck = true,
               this.popSerProvider.showSoundLoading("播放中...",3),
               this.file.removeFile(this.fileUrl,fileName),
               window.setTimeout(() =>this.recordData.release(), 2000), 
  
             
             ); 
          } else if (!this.platform.is('ios')) {
            //alert("asdf1");
            this.recordData2 = this.media.create(this.fileUrl+"userlock.wav");  
            this.recordData2.play();
            //alert("asdf2");
  
            var captureCfg1 = {
              sampleRate: audioinput.SAMPLERATE.CD_AUDIO_44100Hz,
              bufferSize: 16384,
              channels: audioinput.CHANNELS.MONO,
              format: audioinput.FORMAT.PCM_16BIT,
              normalize: true,
              normalizationFactor: 32767.0,
              streamToWebAudio: false,
              audioContext: null,
              concatenateMaxChunks: 10,
              audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT,
              fileUrl: this.fileUrl+ "Record.wav"
              
              };
          
            audioinput.start(captureCfg1);
             window.setTimeout(() => this.stopRecord(), 2000);
               
  
             this.recordData2.onSuccess.subscribe(() => 
                    this.isCheck = true,this.isCheck = true,
                    this.popSerProvider.showSoundLoading("播放中...",3),
                   
                    
                    window.setTimeout(() =>this.recordData.release(), 2000), 
                ); 
  
  
  
          }  
                
        // }).catch(error => {
        //   this.isCheck = false;
        // })
     

    }
    

     // cordova-plugin-media-capture 的使用
     startRecording_MediaCapture() {
      this.platform.ready().then(() => {
       
          // 设置录音参数：duration限制录音长度，单位秒，仅ios有效
          let options: CaptureAudioOptions = { limit: 1, duration: 4};
         
          this.mediaCapture.captureAudio(options)
              .then(
              function (mediaFiles: MediaFile[]) {
                  var i, len;
                  for (i = 0, len = mediaFiles.length; i < len; i += 1) {

                      alert("Record success! \n\n"
                          + "file name: " + mediaFiles[i].name + "\n\n"
                          + "size: " + (mediaFiles[i].size / 1024).toFixed(2) + "KB" + "\n\n"
                          + "fullPath: " + mediaFiles[i].fullPath + "\n\n"
                          + "lastModifiedDate: " + (mediaFiles[i].lastModifiedDate) + "\n\n"
                          + "type: " + mediaFiles[i].type + "\n\n");

                      // 上传
                      this.fileName = mediaFiles[i].name;
                      //this.uploadFile(mediaFiles[i].fullPath);
                  }
              },
          );
      });
  }

  startReocrd(){  //开始录音

    //创建media对象，参数文件名字，上面的filePath也指定了文件存放位置和文件名字
    this.recordData1 = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+ "Record.wav");

    //开始录音

    //this.popSerProvider.toast("this is a start");
    this.popSerProvider.toast("start rerord");   
    
    this.recordData1.startRecord();
  }

  pauseRecord(){   

      //暂停录音
      this.recordData1.pauseRecord();

  }

  play(){   

      //播放录音
      this.recordData1.play();

  }

  resumeRecord(){   

      //继续播放录音
      this.recordData.resumeRecord();

  }

  stopRecord(){   
         //停止结束录音
      if (this.platform.is('ios')) {
        this.recordData1.stopRecord();
      }else{
        audioinput.stop();
        //this.popSerProvider.toast("stop record");
        

      }
      

      
    
    window.setTimeout(() => this.decodeVoiceTest(), 1000); 
    //  window.setTimeout(() => this.decodeVoiceTest(), 2000);
      

  }


  MAX_FREQ1:any = 4;
	CODE_WIDTH1:any = 1470;    //码元宽度
	WIDTH_FREQ1:any = 1470;
	WIDTH_SPACE:any = (this.CODE_WIDTH1-this.WIDTH_FREQ1);
	WIDTH_1_3:any = (this.CODE_WIDTH1/3);
	WIDTH_2_3:any = (this.CODE_WIDTH1*2/3);
	WIDTH_3_3:any = this.CODE_WIDTH1;
	WIDTH_1_2:any = (this.CODE_WIDTH1/2);
	WIDTH_4_3:any = (this.CODE_WIDTH1*4/3);
	
	//高群频率系数 
     coefs01:any = [1.970840043,1.963118314,1.956295201,1.946962421];
	//低群频率系数 
	 coefs11:any= [1.990343251,1.987662569,1.985693853,1.982468747];

	rr1:any=[1.970840043,1.963118314,1.956295201,1.946962421];
	buf11:any;
	
	public  post_testing_code(){
	  var index = [0,0];
  	   var i,j,k,n,tmp,tmpIndex;
		
		var fRatio0=2.0; //判别系数，非常重要 
						
		//冒泡法将各频率的序号按幅值由大到小排序
		for(i=0;i<this.MAX_FREQ1;i++)
			index[i]=i;	
		for(i=0;i<this.MAX_FREQ1-1;i++)
		{
			for(j=0;j<this.MAX_FREQ1-1-i;j++)
			{
				if(this.rr1[index[j]]<this.rr1[index[j+1]])
				{
					tmp=index[j];
					index[j]=index[j+1];
					index[j+1]=tmp;
				}
			}		
		}
		
		var ftmp=(this.rr1[index[0]]/this.rr1[index[1]]);
	//	alert("ftmp="+ftmp+","+this.rr[index[0]] +","+this.rr[index[1]]+","+index[0]+","+index[1]);
		if(ftmp>fRatio0)
			return index[0];

		return 100;
	}
	/*************************************************
	名称：goertzel
	作用：用 goertzel算法计算某个频率的幅值 
	参数：
			short* buf--包含采集点数值的缓存
			unsigned short begin--起始点
			unsigned short end--结束点 
			double coe--频率计算因子 
	返回：
		该频率的幅值 
	******************************************************/
	 goertzel(begin,  end,  coe,index ,buf)
	{
		var      qq0=0.000000,qq1=0.000000,qq2=0.00000,aa=0.00000;
		var i;


	    for ( i=begin; i<end; i++ )
	    {
		//	temp1 = (this.buf[i*2+1+index]&0xff)<< 8;
	//		temp2 = temp1 | this.buf[2*i+index]&0xff;
	//		Int16
	        qq0 = coe * qq1- qq2 + buf[index+i];
	        qq2 = qq1;
			qq1 = qq0;
			//alert((qq1)+","+(qq2)+","+(qq0)+","+coe+","+this.buf[i*2+index]);
		}
		

		aa = Math.sqrt((qq1 * qq1) + (qq2 * qq2) - (coe * qq1 * qq2));
		
	 //   alert((qq1)+"[qq1],"+(qq2)+"[qq2],"+(coe)+",[aa:]"+aa);    
	    return(aa);

	}


	/***************************************************************** 
	名称：getDataFromFreq
	作用：从频谱得到数据 
	参数：
			unsigned short nFreq--主频率 
			unsigned short mFreq--次频率 
	返回： 解码后的数据   
	******************************************************************/
	getDataFromFreq(nFreq,mFreq)
	{
		return (nFreq*4+mFreq);
	} 


	/***************************************************************** 
	名称：getFreqNo
	作用：从数据中根据概率算法得到频率代号 
	参数：
			short* buf--包含采集点数值的缓存
			unsigned short begin--起始点
			unsigned short end--结束点 
			double *r--幅值的数组指针
			double *coefs--频率系数 
	返回： 频率代号，如果没有频率则返回100
			   
	******************************************************************/
	getFreqNo(begin,end,coefs,index,buf)
	{
		var i;

		for(i=0; i<this.MAX_FREQ1; i++)
		{
			this.rr1[i]=this.goertzel(begin,end,coefs[i],index,buf);
		}

		//alert("rr:"+this.rr);
		return this.post_testing_code();
			
	}

	/***************************************************************** 
	名称：decodeVoice
	作用：声波解码
	参数：
			string &sFile--wav声音文件名 

	返回： 解码后的数据   
	   		0--门禁回应的是“失败”
			5--门禁回应的是“成功”
			其他--搜索到的是错误信息 
	******************************************************************/

  countNum:any = 0 ;
	decodeVoiceTest(){
    console.log("decodeVoiceTest  start[cloudshare]"+this.countNum);
		 this.file.readAsArrayBuffer(this.fileUrl, 'Record.wav').then(response => {
     this.file.removeFile(this.fileUrl,'Record.wav');  
     
      
     var count = this.decodeVoice(this.fileUrl+'Record.wav', new Int16Array(response));
     if(count=='100'){
      
        //
        if(this.countNum ==0){
          //this.file.removeFile(this.fileUrl,'Record.wav');  
          window.setTimeout(() =>  this.adminUnlock2(), 2000);
         
        }
        
      }else{
        
      }
    
    
    }).catch(error => {
		
	 	})
		
	
		
	}
	testasd(response){
		alert(response);
	}

	decodeVoice(sFile,buf)
	{
 
   
		var step=0;
		var iFileLen;
		var i;

		var nFreq,mFreq;

		var datafreq =new Array(2);
		
 

		var tmpCur;
		var index = 22;

		while(true)
		{
		
			if(buf.length - index < this.CODE_WIDTH1){
       
        return 100;
      }

			switch(step)
			{
				case 0:
					
						nFreq = this.getFreqNo(0,this.CODE_WIDTH1,this.coefs01,index,buf);
						if(nFreq > 1)
							break;
							
						mFreq=this.getFreqNo(0,this.CODE_WIDTH1,this.coefs11,index,buf);
						if(mFreq>1)
							break;
						datafreq[0]=this.getDataFromFreq(nFreq,mFreq);
						if((datafreq[0]==0) || (datafreq[0]==5))
						{
							step++;
						}
										
					
					
					break;
				case 1:
					
						nFreq=this.getFreqNo(0,this.CODE_WIDTH1,this.coefs01,index,buf);
						if(nFreq>1)
						{
							step=0;
							break;
						} 
						mFreq=this.getFreqNo(0,this.CODE_WIDTH1,this.coefs11,index,buf);
						if(mFreq>1)
						{ 
							step=0;
							break;
						} 
						datafreq[1]=this.getDataFromFreq(nFreq,mFreq);
						if((datafreq[1]==0) || (datafreq[1]==5))
						{
							if(datafreq[1]==datafreq[0])
							{
                console.log("decodeVoice  end[cloudshare ]value"+datafreq[1]);
								return(datafreq[1]);
							}
							else
							{
								datafreq[0]	=  datafreq[1]; 
							}
						}

					break;
			
			}
      			index += this.CODE_WIDTH1;
    }		
    
	}
  
}
