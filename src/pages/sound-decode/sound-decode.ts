import { Component } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams,Platform, Thumbnail,App } from 'ionic-angular';
import { Media,MediaObject } from '@ionic-native/media';
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfig } from '../../app/app.config';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';

/**
 * Generated class for the SoundDecodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sound-decode',
  templateUrl: 'sound-decode.html',
})
export class SoundDecodePage {

  constructor(private appCtrl: App,public popSerProvider:PopSerProvider,private platform:Platform, private alertCtrl:AlertController, private transfer: FileTransfer, private media: Media , private file: File ,public navCtrl: NavController, public navParams: NavParams) {
    this.appconfig = new AppConfig();
  }
  public appconfig:any;
  fileUrl:any;  //文件存放地址 
  test:any;
  ionViewDidLoad() {
	  if (this.platform.is('ios')) {
		this.fileUrl = this.file.tempDirectory;
	  //alert(this.fileUrl);
	  } else if (!this.platform.is('ios')) {
		//this.fileUrl =this.file.externalRootDirectory;
		this.fileUrl = this.file.externalDataDirectory;  
	  }    


	 
	  this.decodeVoiceTest();
	   //alert(this.fileUrl+'soundDecode.wav');

	 

    }  
    MAX_FREQ:any = 4;
	CODE_WIDTH:any = 1470;    //码元宽度
	WIDTH_FREQ:any = 1470;
	WIDTH_SPACE:any = (this.CODE_WIDTH-this.WIDTH_FREQ);
	WIDTH_1_3:any = (this.CODE_WIDTH/3);
	WIDTH_2_3:any = (this.CODE_WIDTH*2/3);
	WIDTH_3_3:any = this.CODE_WIDTH;
	WIDTH_1_2:any = (this.CODE_WIDTH/2);
	WIDTH_4_3:any = (this.CODE_WIDTH*4/3);
	
	//高群频率系数 
     coefs0:any = [1.970840043,1.963118314,1.956295201,1.946962421];
	//低群频率系数 
	 coefs1:any= [1.990343251,1.987662569,1.985693853,1.982468747];

	rr:any=[1.970840043,1.963118314,1.956295201,1.946962421];
	buf1:any;
	
	public  post_testing_code(){
	  var index = [0,0];
  	   var i,j,k,n,tmp,tmpIndex;
		
		var fRatio0=2.0; //判别系数，非常重要 
						
		//冒泡法将各频率的序号按幅值由大到小排序
		for(i=0;i<this.MAX_FREQ;i++)
			index[i]=i;	
		for(i=0;i<this.MAX_FREQ-1;i++)
		{
			for(j=0;j<this.MAX_FREQ-1-i;j++)
			{
				if(this.rr[index[j]]<this.rr[index[j+1]])
				{
					tmp=index[j];
					index[j]=index[j+1];
					index[j+1]=tmp;
				}
			}		
		}
		
		var ftmp=(this.rr[index[0]]/this.rr[index[1]]);
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
	 goertzel(begin,  end,  coe,index )
	{
		var      qq0=0.000000,qq1=0.000000,qq2=0.00000,aa=0.00000;
		var i;


	    for ( i=begin; i<end; i++ )
	    {
		//	temp1 = (this.buf[i*2+1+index]&0xff)<< 8;
	//		temp2 = temp1 | this.buf[2*i+index]&0xff;
	//		Int16
	        qq0 = coe * qq1- qq2 + this.buf1[index+i];
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
	getFreqNo(begin,end,coefs,index)
	{
		var i;

		for(i=0; i<this.MAX_FREQ; i++)
		{
			this.rr[i]=this.goertzel(begin,end,coefs[i],index);
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

	decodeVoiceTest(){
		this.file.readAsArrayBuffer(this.fileUrl, 'soundDecode1.wav').then(response => {
			//alert(response.byteLength);
			this.test= new Int16Array(response);
			this.buf1 = new Int16Array(response);
		//	alert(this.buf1.length);
			alert(this.decodeVoice(this.fileUrl+'soundDecode1.wav'));	
		}).catch(error => {
		
		})
		
	
		
	}
	testasd(response){
		alert(response);
	}

	decodeVoice(sFile)
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
		
			if(this.buf1.length - index < this.CODE_WIDTH)
				return 100;

			switch(step)
			{
				case 0:
					
				//		cout<<"从离文件头的"<<ftell(fs)<<"处寻找门禁回应码..."<<endl; 
											
					
						nFreq = this.getFreqNo(0,this.CODE_WIDTH,this.coefs0,index);
						//if(index>250000)
						//alert("0nFreq:"+nFreq+",index:"+index+","+this.buf.byteLength);
						if(nFreq > 1)
							break;
							
						mFreq=this.getFreqNo(0,this.CODE_WIDTH,this.coefs1,index);
						//if(index>250000)
						//alert("0mFreq:"+mFreq+",index:"+index);
						if(mFreq>1)
							break;
						datafreq[0]=this.getDataFromFreq(nFreq,mFreq);
						if((datafreq[0]==0) || (datafreq[0]==5))
						{
					//		cout<<"找到回应码第一次，";
					//		if(datafreq[0]==0)
					//			cout<<"回应码是：失败"<<endl;
					//		else
					//			cout<<"回应码是：成功"<<endl;
							step++;
						}
										
					
					
					break;
				case 1:
					
						nFreq=this.getFreqNo(0,this.CODE_WIDTH,this.coefs0,index);
						//if(index>250000)
						//alert("1nFreq:"+nFreq+",index:"+index);
						if(nFreq>1)
						{
							step=0;
					//		cout<<"没找到回应码！"<<endl; 
							break;
						} 
						mFreq=this.getFreqNo(0,this.CODE_WIDTH,this.coefs1,index);
						//if(index>250000)
						//alert("1mFreq:"+mFreq+",index:"+index);
						if(mFreq>1)
						{ 
							step=0;
			//				cout<<"没找到回应码！"<<endl; 
							break;
						} 
						datafreq[1]=this.getDataFromFreq(nFreq,mFreq);
						if((datafreq[1]==0) || (datafreq[1]==5))
						{
				//			cout<<"找到回应码第二次，";
					//		if(datafreq[1]==0)
					//			cout<<"回应码是：失败"<<endl;
					//		else
					//			cout<<"回应码是：成功"<<endl;
							if(datafreq[1]==datafreq[0])
							{
					//			cout<<"两次回应码是一致的！"<<endl;
								return(datafreq[1]);
							}
							else
							{
						//		cout<<"两次回应码不一致，再寻找！"<<endl;
								datafreq[0]	=  datafreq[1]; 
							}
						}
										
					
					
					break;
			
			}
      			index += this.CODE_WIDTH;
		}		
		//return 100;
	}

}
