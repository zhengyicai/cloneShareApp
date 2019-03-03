import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform, Thumbnail,App } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import { JsonPipe } from '@angular/common';

/**
 * Generated class for the UserRoomCardListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var audioinput: any;
@IonicPage()
@Component({
  selector: 'page-user-room-card-list',
  templateUrl: 'user-room-card-list.html',
})
export class UserRoomCardListPage {

  constructor(public httpSerProvider:HttpSerProvider,private appCtrl: App,public popSerProvider:PopSerProvider,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
  }


  isCheck:boolean =true;   //控制打开 true:success false:unsuccess
  public appconfig:any;
  public filePath : any; //录音文件的名字
  public recordData : any; //录音对象
  public recordData1:any; //录音对象2
  public playData : any; //录音对象

  csArray:any = new Array(2); //厂商代码byte两位
  areaArray:any = new Array(3); //项目代码byte三位
  equArray:any = new Array(5); //设备代码byte三位
  crc16:any = new Array(5);

  icodeArray= new Array(6); //序列号

  areaCode:any="";
  userCode:any = "";
  equCode:any= "";  //设备编码
  fileUrl:any;  //文件存放地址 

  person:any;
  roomList:any;

  userCodeLock:any = "";
  cardCodeId:any = "";
  cardEquipmentId:any = "";

  delState:any = false; //是否删除
   comunityCode:any = "";                      //物业用户编码

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomCardListPage');
    this.person ={
      defaultRoomId:this.navParams.get("roomId"),
      equipmentId:this.navParams.get("equipmentId")
    }


    if (this.platform.is('ios')) {
      this.fileUrl = this.file.tempDirectory;
    //alert(this.fileUrl);
    } else if (!this.platform.is('ios')) {
      this.fileUrl = this.file.externalDataDirectory;  
    }      
 
    this.recordData1 = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+ "RecordCard.wav");

    this.roomList = [];
    this.loadData();
  }

  loadData(){
    this.httpSerProvider.get('/equipment/getUserCardList',{equipmentId:this.person.equipmentId}).then((data:any)=>{
          if(data.code==='0000'){
            //this.citylist = data.data;
            this.roomList = data.data;
          }else if(data.code==='9999'){
            this.popSerProvider.toast(data.message);
          }else{
            this.popSerProvider.toast(data.message); 
          }  
    });
    var option = JSON.parse(localStorage.getItem("communityData"));   
    var csCode = option.csCode;  //厂商代码   10进制
    var areaCode= option.areaCode;  //项目代码   10进制
    this.areaCode=areaCode;
    this.userCode = option.roomId; //
    this.comunityCode = areaCode+"01010001";  //00000001会报错
   
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


  //重复删除
  delAllCard(){
    let alert = this.alertCtrl.create({
      title: '是否确认发卡？',
      message: '',
      buttons: [
        {
          text: '返回',
          role: '返回',
          handler: () => {
            console.log('Cancel clicked');
            
          }
        },
        {
          text: '确认',
          handler: () => {
            //this.popSerProvider.toast("allDel");
            for(var i = 0 ;i<this.roomList.length;i++){
              this.delState = true;
              this.cardCodeId =this.roomList[i].id;
              this.cardEquipmentId = this.person.equipmentId;  
              this.allStatus(i);
              
            }
          }
        }
      ]
    });
    alert.present();
    
    

  }


  //重复发卡
  replaceAllCard(){
    let alert = this.alertCtrl.create({
      title: '是否确认发卡？',
      message: '',
      buttons: [
        {
          text: '返回',
          role: '返回',
          handler: () => {
            console.log('Cancel clicked');
            
          }
        },
        {
          text: '确认',
          handler: () => {
          
            for(var i = 0 ;i<this.roomList.length;i++){
              this.delState = false;
              this.cardCodeId =this.roomList[i].id;
              this.cardEquipmentId = this.person.equipmentId;  
              this.allStatus(i);
             
            
            }
            //this.popSerProvider.toast("allreplace"+ JSON.stringify(this.roomList));
            
          }
        }
      ]
    });
    alert.present();
   
   

   

  }

  public setCardId(){    
    this.adminUnlock("00001001010101","555555","");
  }

  public allStatus(one:any){
    
    window.setTimeout(() =>this.adminUnlock(this.comunityCode,this.roomList[one].cardNo,this.roomList[one].id),1000+one*4000);
   // this.popSerProvider.toast(JSON.stringify(one));
   
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
  public adminUnlock(userCodeStr,cardCodeStr,id){
    this.cardCodeId = id;

    //this.popSerProvider.toast(userCodeStr+","+cardCodeStr);
    //机子返回的是16进制	
      
      //获取当前传值的数据
    
      
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
      if(this.delState == true){
        str = [0xE7,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],0,0,0,0,cardNo[2],cardNo[1],cardNo[0]];  
      }else{
        str = [0xE7,crc[1],crc[0],icodeArray[0],icodeArray[1],icodeArray[2],icodeArray[3],icodeArray[4],data[3],data[2],data[1],data[0],cardNo[2],cardNo[1],cardNo[0]];  
      }
      
     
      // str = [0xB5,crc[1],crc[0],0xff,0xff,0xff,0xff,0xff,data[3],data[2],data[1],data[0]]; 
     
    
      //var fileName=this.subData.unitId+'.wav';
      var fileName=userCodeStr+'card.wav';
     
        
      var str1  = this.appconfig.sound(str); 
      // console.log(str1);
      this.file.createFile( this.fileUrl,fileName,true);
      
     
      this.file.writeExistingFile(this.fileUrl,fileName,str1).then(response => {
     
        if (this.platform.is('ios')) {
          this.playData = this.media.create(this.fileUrl.replace(/^file:\/\//, '')+fileName);
          this.playData.play();
          this.popSerProvider.showSoundLoading("播放中...",2);  


           this.playData.onStatusUpdate.subscribe(status=>
              //console.log("status="+status)
              this.testSuccess(status)
              
          )
        } else if (!this.platform.is('ios')) {
          
          this.recordData = this.media.create(this.fileUrl+fileName);  
          this.recordData.play();
          this.recordData.onSuccess.subscribe(() => 
              this.isCheck = true,this.isCheck = true,this.popSerProvider.showSoundLoading("播放中...",3),
              this.file.removeFile(this.fileUrl,fileName)
          ); 
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
            fileUrl: this.fileUrl+ "RecordCard.wav"
            };
           
           audioinput.start(captureCfg);
           
           window.setTimeout(() => this.stopRecord(), 2500);
        }

       
              // this.recordData.play();
              // this.recordData.onSuccess.subscribe(() => 
              //     this.isCheck = true,this.isCheck = true,this.popSerProvider.showSoundLoading("播放中...",3),
              //     this.file.removeFile(this.fileUrl,fileName)
              // ); 
              
              
      }).catch(error => {
        this.isCheck = false;
      })
     

    }

    public testSuccess(status:any){

      if(status ==4){
        //this.popSerProvider.showSoundLoading("播放中...",2),
        
        console.log("testSuccess Start");

        this.startReocrd();
        console.log("testSuccess Stop");
        this.stopRecord();

        //window.setTimeout(() => this.stopRecord(), 2000);
      }
      
      

    }

    startReocrd(){  //开始录音
    
      //创建media对象，参数文件名字，上面的filePath也指定了文件存放位置和文件名字
      
  
      //开始录音
      this.recordData1.startRecord();
    }
    stopRecord(){   

      //停止结束录音
        if (this.platform.is('ios')) {
          //this.playData.release();
          this.playData.release();
          console.log("record Stop  start[cloudshare]"),
          window.setTimeout(() =>this.recordData1.stopRecord(),500);
          window.setTimeout(() => this.decodeVoiceTest(), 700); 
        }else{
          this.recordData.release();
          audioinput.stop();
          //this.popSerProvider.toast("stop record");
          window.setTimeout(() => this.decodeVoiceTest(), 300); 
        }
      //    window.setTimeout(() => this.decodeVoiceTest(), 1000); 
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
      
      decodeVoiceTest(){
        
         this.file.readAsArrayBuffer(this.fileUrl, 'RecordCard.wav').then(response => {
         //this.file.removeFile(this.fileUrl,'RecordCard.wav');  
         
         // alert(response)
         var count = this.decodeVoice(this.fileUrl+'RecordCard.wav', new Int16Array(response));
         console.log("decodeVoice  end[cloudshare ]"+count);
         //this.popSerProvider.toast("count"+count);
         
         
         //this.recordData.release();
         if(count=='100'){
            
              //第二次开锁无论成功或失败，都会执行该方法
              this.isCheck = false;
              //this.textLoading = "开锁失败";
              //this.popSerProvider.showSoundLoadingHide();
              //this.popSerProvider.toast("count="+count);
              if(this.delState == true){
                this.popSerProvider.showImgLoading("删卡失败",2);  
              }else{
                this.popSerProvider.showImgLoading("发卡失败",2);
              }
            
          }else if(count=='5'){
            
                //第二次开锁无论成功或失败，都会执行该方法
                  this.isCheck = true;
                 

                 

                  var person1 = {
                    cardId:this.cardCodeId,
                    equipmentId:this.cardEquipmentId,
                    linkState:"10"
                  }
                  if(this.delState == true){  //执行删除功能
                      person1.linkState ="20";
                  }
                  // this.popSerProvider.toast(JSON.stringify(person1));
                  this.httpSerProvider.post('/equipment/updateUserCardState',person1).then((data:any)=>{
                        if(data.code==='0000'){
                          if(this.delState == true){
                            this.popSerProvider.showImgLoading("删卡成功",1);  
                          }else{
                            this.popSerProvider.showImgLoading("发卡成功",1);
                          }
                          
                          this.loadData();
                          //this.citylist = data.data;
                          //this.roomList = data.data;
                        }else if(data.code==='9999'){
                          this.popSerProvider.toast(data.message);
                        }else{
                          this.popSerProvider.toast(data.message); 
                        }  
                  });



                //  this.textLoading = "开锁成功";
                  //this.popSerProvider.showSoundLoadingHide();
            
    
            
          }else{
            this.isCheck = false;
            //this.textLoading = "开锁失败";  
            //this.popSerProvider.showSoundLoadingHide();
    
          }
          
          //return count;
        
        }).catch(error => {
          this.isCheck = false;
          //this.textLoading = "无录音权限";  
          this.popSerProvider.showSoundLoadingHide();
          console.log("decodeVoice  loadfile error[cloudshare ]");
         })
        
        // return 0;
      
        
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

        if(buf.length < this.CODE_WIDTH1)
          return 100;

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
                  // console.log("decodeVoice  end[cloudshare ]value"+datafreq[1]);

                    if(datafreq[1] ==5){
                     this.isCheck = true;
                    }else{
                      
                    }
                    
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

  del(opt){
    let alert = this.alertCtrl.create({
      title: '是否确认删卡？',
      message: '',
      buttons: [
        {
          text: '返回',
          role: '返回',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确认',
          handler: () => {
            this.delState = true;
            this.cardCodeId =opt.id;
            this.cardEquipmentId = this.person.equipmentId;  
            this.adminUnlock(this.comunityCode,opt.cardNo,this.cardCodeId);
            
          }
        }
      ]
    });
    alert.present();  

  }
  add(opt:any){
    
    let alert = this.alertCtrl.create({
      title: '是否确认发卡？',
      message: '',
      buttons: [
        {
          text: '返回',
          role: '返回',
          handler: () => {
            console.log('Cancel clicked');
            
          }
        },
        {
          text: '确认',
          handler: () => {
            //this.popSerProvider.toast(opt.roomNo+","+opt.cardNo);  
            this.delState = false;
            this.cardCodeId =opt.id;
            this.cardEquipmentId = this.person.equipmentId;  
           // this.popSerProvider.toast(this.comunityCode+","+opt.cardNo+","+this.cardCodeId);
            this.adminUnlock(this.comunityCode,opt.cardNo,this.cardCodeId);
            
            
          }
        }
      ]
    });
    alert.present();

  }
}
