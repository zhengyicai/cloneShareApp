/**
 * 请求地址头
 */
// 本地环境
export const APP_SERVE_URL:string = 'http://192.168.1.140:8080/app';
//export const APP_PIC_URL:string = 'http://dev.sutongbao.file.yb.com/';
// 生产环境
//export const APP_SERVE_URL:string = 'http://192.168.2.202:8910/web';
//export const APP_PIC_URL:string = 'http://dev.sutongbao.file.yb.com/';
// 测试环境
//export const APP_SERVE_URL:string = 'http://123.207.121.118:8080/app';
export const APP_PIC_URL:string = 'http://test.sutongbao.file.yb.com/';
export const APP_FILE_URL:string = 'http://123.207.121.118/sound/';

// 正式环境
//export const APP_SERVE_URL:string = 'http://vpay.luck8864.com/api/web';
//export const APP_PIC_URL:string = 'http://file.luck8864.com/';



//AES加密key

/**
 * App配置信息
 */
export class AppConfig {
    //static PCmodel:boolean = false;        //PC端调试模式
    //static Appmodel:number=3;             //1首次启动  2.今日首次启动 3普通模式启动
    //分页参数
    static pageSize:number = 15;  //每页显示的行数 
    static requestTime:number = 5;  //禁止重复请求
    //设备信息
    static deviceId:string = '';          //设备id
    static appVersion:string = '1.0.6';        //版本号 2.0.2
    static userName:string = '';          //账号名
    static token:string = '';             //token
    static AES_key:string ="";
    static userId:string  = 'test';  //登录用户id
    static paraSort:any = []; //参数类型
    static currencyType:any = []; //币种类型
    static countryType:any = []; //国家地区
    static updateshow:boolean = true; //是否显示更新页面
    //static deviceCordova:string = '';          //设备上运行的Cordova版本
    //static deviceModel:string = '';           //设备型号或产品的名称
    //static devicePlatform:string = '';          //操作系统名称
    //static devicePlatformVersion:string = '';          //操作系统版本
    //static deviceManufacturer:string = '';          //设备的制造商
    //static deviceSerial:string = '';          //设备硬件序列号
    //APP信息
    //static platform:string = '';          // android  iostru
    //static appName:string = 'CRM_KmfApp';           //CRM_KmfApp
    
    //常规配置
    //static userProtocol:string = '';      //用户协议
    //导购用户信息
    
    
    
    //导购配置信息
    //static callingType:number = 2;        //通话方式      [1,2,3] 1免费 2普通  3两者
    //static inited:boolean=true;              //系统是否可用 (指该执行人员归属的数据是否准备完毕)
    //static balanceMinute:number = 0;      //剩余通话分钟数
    //static showCustomerPhone:boolean=false;   //是否显示会员电话号码（导购可见）
    //授权信息
    //static expireDate:any = '2018.01.01';           //APP到期日期
    //极光推送
    //static jPushRegistrationId:string='';            //极光的注册id;
    //static jPushAlias:string='';                //极光的别名;
    //static jPushTags:string='';                //极光的标签;
    
   

    
    //获取设备高度
    public static getWindowHeight() {
        return window.screen.height;
    }

    //获取设备宽度
    public static getWindowWidth() {
        return window.screen.width;
    }

    //获取设备屏幕分辨率
    public static getFenbianlv() {
        let x=window.screen.width * window.devicePixelRatio;
        let y=window.screen.height * window.devicePixelRatio;
        return [x,y];
    }
    //获取通话方式
    // public static getCallingType():number {
    //     return this.callingType ;
    // }

    //获取系统是否可用  不可用返回false
    // public static getInited():boolean {
    //     return this.inited;
    // }

    //获取剩余通话分钟数
    // public static getBalanceMinute():number {
    //     return this.balanceMinute ;
    // }

    //获取本地时间  格式：2017-01-03
    public static getLocalTime() {
        let date = new Date();
        let month:any = date.getMonth() + 1;
        let strDate:any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let dd:string = date.getFullYear() + "-" + month + "-" + strDate;
        return dd;
    }

    //获取本地时间  格式：20170103
    public static getLocalTime2() {
        let date = new Date();
        let month:any = date.getMonth() + 1;
        let strDate:any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let dd:string = date.getFullYear() + "" + month + "" + strDate;
        return dd;
    }

    //判断系统是否到期  超期返回true
    // public static getIsExpired():boolean {
    //     if(!this.expireDate){
    //         return true;
    //     }
    //     var DateTwo = this.expireDate;
    //     var myDate = new Date();
    //     var DateOne = myDate.toLocaleDateString();
    //     var TwoMonth = DateTwo.substring(5, 7);
    //     var TwoDay = DateTwo.substring(8, 10);
    //     var TwoYear = DateTwo.substring(0, 4);
    //     var cha = ((Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear) - Date.parse(DateOne)) / 86400000);
    //     return (cha < 0) ? true : false;
    // }

    //获取token
    public static getToken():string {
        return this.token || '';
    }

    //获取平台  ios android  none（小写）
    // public static getPlatform():string {
    //     return this.platform || '';
    // }

    //获取设备id
    public static getDeviceid():string {
        return this.deviceId || '';
    }

    //获取App名称
    // public static getAppName():string {
    //     return this.appName || '';
    // }

    //获取App版本号  数字 2000001
    public static getAppVersion():any {
        let version = this.appVersion || '';
        let t:any = version.split('.');
        let num:number = parseInt(t[0]) * 1000000 + parseInt(t[1]) * 1000 + parseInt(t[2]);
        return num || '';
    }

    //获取账号
    public static getuserName():string {
        return this.userName || '';
    }

    //获取用户信息
    // public static getUserInfo() {
    //     let userInfo = {
    //         userId: 0, //用户Id
    //         uuid: 0, //全局用户Id
    //         userName: '',
    //         token: '',
    //         orgId: 0,  //会员组织机构Id
    //         name: '',  //会员名称
    //         mobile: '' //执行人员的联系方式
    //     };
    //     return this.userInfo || userInfo;
    // }

    //去字符串两侧空格
    public static trim(str) {
        return str.replace(/(^s*)|(s*$)/g, "");
    }

    public static getTestCount(){
        let x=Math.floor((Math.random()*4));
        let cc:any={
            name:'测试号:谢大见',
            number:'18558756920',
        };
        if(x===0){
            cc={
                name:'测试号0:赵',
                number:'15306907390',
            }
        }else if (x==1){
            cc={
                name:'测试号1:林',
                number:'13459202232',
            }
        }else if (x==2){
            cc={
                name:'测试号2:袁',
                number:'18221612515',
            }
        }else if (x==3){
            cc={
                name:'测试号3:詹',
                number:'18250347781',
            }
        }else if (x==4){
            cc={
                name:'测试号4:阳阳',
                number:'15060067536',
            }
        }
        return cc;
    }

    //正则，不能输入表情
    public static RegExp(str,event) {
        let regex=/[^\a-zA-Z0-9\u4E00-\u9FA5]/g;
        if(regex.test(str)){
            str = str.replace(regex, "");
            event.target.value=str;//显示文本替换掉
           return false;
        }
    }

    // 正则，不能输入表情和中文
    public static RegExpCn(str) {
        let regex=/[^\a-zA-Z0-9\|\$\(\)\*\+\.\[\]\?\\\/\^\{\}\-~`!@#%&_=,<>;:'"]/g;
        if(regex.test(str)){
            // str = str.replace(regex, "");
            // event.target.value=str;//显示文本替换掉
            return true;
        }
    }
    public sound(str:any){
		var binaryData = this.PlaySound(str); //普通数组
		//要保存的数据是10个二进制位，但是一个字节是8位，so，需要16位,2个字节
		var binLen = binaryData.length;
		
		var buffer = new ArrayBuffer(binLen); // 开辟两个字节的缓冲区
		var byteData = new Uint8Array(buffer);
		  for(var i=0; i<binLen ; i++) { //开始转化为8进制
             byteData[i] = binaryData[i];
         }
         
		return new Blob([byteData],{type:"application/octet-stream"});

	}



    public  PlaySound(data:any){
		var strwav = "";
		var crc = this.crc8(data,data.length);

		var dataEncode = this.encode(data, crc);
		var crc2 = this.crc8_Reverse(dataEncode,dataEncode.length);

		
		var dataCmd = new Array((dataEncode.length+1)*2);
		for (var i = 0; i < dataEncode.length; i++) {
			dataCmd[i*2] =  ((dataEncode[i]>>4) & 0x0f);
			dataCmd[i*2+1] = (dataEncode[i] & 0x0f);
		}
		dataCmd[dataCmd.length-2] =  ((crc2>>4) & 0x0f);
		dataCmd[dataCmd.length-1] =  (crc2 & 0x0f);
		
		for (var i = 1; i < dataCmd.length; i++) {
			if(dataCmd[i-1] == dataCmd[i])
				dataCmd[i] = 'R';
        }
        
        //byte[] wav =new byte[1024*1024];
        //console.log(dataCmd);
        var  len  = this.WriteCommmand(dataCmd,this.wav);
        
        return this.wav.slice(0,len);
	
    }
    wav:any = new Array(1024*1024);
    public CRC8_TAB = [
            0x00, 0x07, 0x0E, 0x09, 0x1C, 0x1B, 0x12, 0x15, 0x38, 0x3F, 0x36, 0x31, 0x24, 0x23, 0x2A, 0x2D,
            0x70, 0x77, 0x7E, 0x79, 0x6C, 0x6B, 0x62, 0x65, 0x48, 0x4F, 0x46, 0x41, 0x54, 0x53, 0x5A, 0x5D,
            0xE0, 0xE7, 0xEE, 0xE9, 0xFC, 0xFB, 0xF2, 0xF5, 0xD8, 0xDF, 0xD6, 0xD1, 0xC4, 0xC3, 0xCA, 0xCD,
            0x90, 0x97, 0x9E, 0x99, 0x8C, 0x8B, 0x82, 0x85, 0xA8, 0xAF, 0xA6, 0xA1, 0xB4, 0xB3, 0xBA, 0xBD,
            0xC7, 0xC0, 0xC9, 0xCE, 0xDB, 0xDC, 0xD5, 0xD2, 0xFF, 0xF8, 0xF1, 0xF6, 0xE3, 0xE4, 0xED, 0xEA,
            0xB7, 0xB0, 0xB9, 0xBE, 0xAB, 0xAC, 0xA5, 0xA2, 0x8F, 0x88, 0x81, 0x86, 0x93, 0x94, 0x9D, 0x9A,
            0x27, 0x20, 0x29, 0x2E, 0x3B, 0x3C, 0x35, 0x32, 0x1F, 0x18, 0x11, 0x16, 0x03, 0x04, 0x0D, 0x0A,
            0x57, 0x50, 0x59, 0x5E, 0x4B, 0x4C, 0x45, 0x42, 0x6F, 0x68, 0x61, 0x66, 0x73, 0x74, 0x7D, 0x7A,
            0x89, 0x8E, 0x87, 0x80, 0x95, 0x92, 0x9B, 0x9C, 0xB1, 0xB6, 0xBF, 0xB8, 0xAD, 0xAA, 0xA3, 0xA4,
            0xF9, 0xFE, 0xF7, 0xF0, 0xE5, 0xE2, 0xEB, 0xEC, 0xC1, 0xC6, 0xCF, 0xC8, 0xDD, 0xDA, 0xD3, 0xD4,
            0x69, 0x6E, 0x67, 0x60, 0x75, 0x72, 0x7B, 0x7C, 0x51, 0x56, 0x5F, 0x58, 0x4D, 0x4A, 0x43, 0x44,
            0x19, 0x1E, 0x17, 0x10, 0x05, 0x02, 0x0B, 0x0C, 0x21, 0x26, 0x2F, 0x28, 0x3D, 0x3A, 0x33, 0x34,
            0x4E, 0x49, 0x40, 0x47, 0x52, 0x55, 0x5C, 0x5B, 0x76, 0x71, 0x78, 0x7F, 0x6A, 0x6D, 0x64, 0x63,
            0x3E, 0x39, 0x30, 0x37, 0x22, 0x25, 0x2C, 0x2B, 0x06, 0x01, 0x08, 0x0F, 0x1A, 0x1D, 0x14, 0x13,
            0xAE, 0xA9, 0xA0, 0xA7, 0xB2, 0xB5, 0xBC, 0xBB, 0x96, 0x91, 0x98, 0x9F, 0x8A, 0x8D, 0x84, 0x83,
            0xDE, 0xD9, 0xD0, 0xD7, 0xC2, 0xC5, 0xCC, 0xCB, 0xE6, 0xE1, 0xE8, 0xEF, 0xFA, 0xFD, 0xF4, 0xF3];

    public crc8(msg_ptr,len) { 
    	var crc = 0;
	 	for (var j = 0; j < msg_ptr.length; j++) {
	 		var value = (crc^msg_ptr[j]) & 0x00ff;
	   		crc = this.CRC8_TAB[value]; 
		}

	 	return crc&0xff;
    }
    
    public encode(msg_ptr,key) {
    	var data = new Array(msg_ptr.length+1);
    	
    	data[0] = key;
	 	for (var j = 0; j < msg_ptr.length; j++) {
	 		data[j+1] = (msg_ptr[j] ^ key);
		}

	 	return data;
    }
    
    public crc8_Reverse(msg_ptr,len) { 
    	var crc = 0;
	 	for (var j = msg_ptr.length-1; j >=0; j--) {
	 		var value = (crc^msg_ptr[j]) & 0x00ff;
	   		crc = this.CRC8_TAB[value]; 
		}

	 	return (crc&0xff);
    }
    
    
    public  CRC16_Check(Pushdata)  {  
		var Reg_CRC=0xffff; 
		var temp;
		var i,j;    
	  
		for(i = 0; i<Pushdata.length; i ++)  
		{  
			temp = Pushdata[i];
			if(temp < 0) temp += 256; 
			temp &= 0xff;
			Reg_CRC^= temp;  
			 
		   for (j = 0; j<8; j++)  
		   {  
			   if ((Reg_CRC & 0x0001) == 0x0001)  
				   Reg_CRC=(Reg_CRC>>1)^0xA001; 
			   else  
				   Reg_CRC >>=1; 
		   }    
		}  
		
		return (Reg_CRC&0xffff);  
    }


    public  CRC16(Pushdata)  {  
        var b = new Array(2);
		var Reg_CRC=0xffff; 
		var temp;
		var i,j;    
	  
		for(i = 0; i<Pushdata.length; i ++)  
		{  
			temp = Pushdata[i];
			if(temp < 0) temp += 256; 
			temp &= 0xff;
			Reg_CRC^= temp;  
			 
		   for (j = 0; j<8; j++)  
		   {  
			   if ((Reg_CRC & 0x0001) == 0x0001)  
				   Reg_CRC=(Reg_CRC>>1)^0xA001; 
			   else  
				   Reg_CRC >>=1; 
		   }    
        }  
        b[0] = (Reg_CRC&0xff);
        b[1] = ((Reg_CRC>>8)&0xff);
		
		return b;  
    }


    private  CODE_WIDTH:any = 1764; 
	private  WIDTH_FREQ:any = 1764;
	private  WIDTH_SPACE:any = (this.CODE_WIDTH-this.WIDTH_FREQ);

	private  WIDTH_1_3:any = (this.CODE_WIDTH/3);
	private  WIDTH_2_3:any = (this.CODE_WIDTH*2/3);
	private  WIDTH_3_3:any = this.CODE_WIDTH;
	private  WIDTH_4_3:any = (this.CODE_WIDTH*4/3);

	private  SYNC_WIDTH:any = 3528; //同步头码元宽度，882--20ms
	private  SYNC_WIDTH_FREQ:any = 2646;
	private  SYNC_WIDTH_SPACE:any = (this.SYNC_WIDTH-this.SYNC_WIDTH_FREQ);
	private  SYNC_WIDTH_1_3:any = (this.SYNC_WIDTH/3);
	private  SYNC_WIDTH_2_3:any = (this.SYNC_WIDTH*2/3);
	private  SYNC_WIDTH_3_3:any = this.SYNC_WIDTH;
	private  SYNC_WIDTH_1_2:any = (this.SYNC_WIDTH/2);
	private  SYNC_WIDTH_4_3:any = (this.SYNC_WIDTH*4/3);

    private  ENV_STEP:any = 530;

    //---------------采用计算法产生音频文件---------------------------- 

    private  writeWaveFileHeader(header, totalAudioLen,
        totalDataLen, longSampleRate, channels, byteRate){
        //byte[] header = new byte[44];
        header[0] = 0x52; // RIFF/WAVE header
        header[1] = 0x49;
        header[2] = 0x46;
        header[3] = 0x46;
        header[4] =  (totalDataLen & 0xff);
        header[5] =  ((totalDataLen >> 8) & 0xff);
        header[6] =  ((totalDataLen >> 16) & 0xff);
        header[7] =  ((totalDataLen >> 24) & 0xff);
        header[8] = 0x57;  //WAVE
        header[9] = 0x41;
        header[10] = 0x56;
        header[11] = 0x45;
        header[12] = 0x66; // 'fmt ' chunk
        header[13] = 0x6D;
        header[14] = 0x74;
        header[15] = 0x20;
        header[16] = 16;  // 4 bytes: size of 'fmt ' chunk
        header[17] = 0;
        header[18] = 0;
        header[19] = 0;
        header[20] = 1;   // format = 1
        header[21] = 0;
        header[22] =  channels;
        header[23] = 0;
        header[24] =  (longSampleRate & 0xff);
        header[25] =  ((longSampleRate >> 8) & 0xff);
        header[26] =  ((longSampleRate >> 16) & 0xff);
        header[27] =  ((longSampleRate >> 24) & 0xff);
        header[28] =  (byteRate & 0xff);
        header[29] =  ((byteRate >> 8) & 0xff);
        header[30] =  ((byteRate >> 16) & 0xff);
        header[31] =  ((byteRate >> 24) & 0xff);
        header[32] =  (1 * 16 / 8); // block align
        header[33] = 0;
        header[34] = 16;  // bits per sample
        header[35] = 0;
        header[36] = 0x64; //data
        header[37] = 0x61;
        header[38] = 0x74;
        header[39] = 0x61;
        header[40] =  (totalAudioLen & 0xff);
        header[41] =  ((totalAudioLen >> 8) & 0xff);
        header[42] =  ((totalAudioLen >> 16) & 0xff);
        header[43] =  ((totalAudioLen >> 24) & 0xff);
        return 44;
    }
    public  getFreqData(j,freq,begin,end,frontStep,backStep)
	{
		return Math.round(32767*Math.sin(2*Math.PI*freq*j/44100)*this.envelope(j,frontStep,backStep,begin,end));
    }
    
    /*************************************************
	名称：envelope
	作用：对声波码元有频率部分加斜坡进行调制 
	参数：
			int j--采集点 
			int frontStep--前肩斜坡的点数
			int backStep--前肩斜坡的点数
			int begin--起始点
			int end--结束点 
	返回：
	    调制值 
	******************************************************/
	public envelope(j,frontStep,backStep,begin,end)
	{
		if((j-begin)<frontStep) return ((j-begin)/frontStep);
		if((end-j)<backStep) return ((end-j)/backStep);
		return 1;
    }
    
    public  WriteCommmand(sCommand,datawav){
		var sLen=sCommand.length;
		var j;
		var m_pcmData;
		var dataFreq = new Array(2);
		
		var len = 0;
		 
		var sDataLen = (2*this.SYNC_WIDTH+sCommand.length*2*this.CODE_WIDTH);
        len = this.writeWaveFileHeader(datawav,sDataLen,sDataLen+36,44100,1,16*44100/8);
        //alert("header"+len);
	    //写入帧起始 
		for(j=0;j<this.SYNC_WIDTH_FREQ;j++)
		{
			var data = this.getFreqData(j,14700,0,this.SYNC_WIDTH_FREQ,49,441);
			dataFreq[1] =((data >> 8) & 0xff);
			dataFreq[0] =((data) & 0xff);
			this.wav[len++] = dataFreq[0];
			this.wav[len++] = dataFreq[1];
		//	fout.write(dataFreq);
		}			
		
		for(j=0;j<this.SYNC_WIDTH_SPACE;j++)
		{
			var data = this.getFreqData(j,14950,0,this.SYNC_WIDTH_SPACE,49,688);
			dataFreq[1] = ((data >> 8) & 0xff);
            dataFreq[0] =  ((data) & 0xff);
            this.wav[len++] = dataFreq[0];
			this.wav[len++] = dataFreq[1];
		//	fout.write(dataFreq);
		}
			
		for(var i=0;i<sLen;i++)
		{			

			if(sCommand[i] == 0){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{ 
					m_pcmData = this.getFreqData(j,14100,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
					dataFreq[0] =  ((m_pcmData) & 0xff);
        //			fout.write(dataFreq);	
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
					dataFreq[0] = 0;
        //			fout.write(dataFreq);	
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
				}					
			}else if(sCommand[i] == 1){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData = this.getFreqData(j,14150,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
					dataFreq[0] =  ((m_pcmData) & 0xff);
				//	fout.write(dataFreq);	
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}
			}else if(sCommand[i] == 2){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14200,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 3){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14250,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}
			}else if(sCommand[i] == 4){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14300,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 5){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14350,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 6){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData = this.getFreqData(j,14400,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 7){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14450,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 8){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14500,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}					
			}else if(sCommand[i] == 9){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14550,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(m_pcmData);
				}
			}else if(sCommand[i] == 10){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14600,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 11){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14650,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}
			}else if(sCommand[i] == 12){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14750,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
			//		fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 13){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData = this.getFreqData(j,14800,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] = ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] = ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);		
				}				
			}else if(sCommand[i] == 14){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData =this.getFreqData(j,14850,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
			}else if(sCommand[i] == 15){
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData = this.getFreqData(j,14900,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
                    dataFreq[0] =  ((m_pcmData) & 0xff);
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
					dataFreq[0] = 0;
        //			fout.write(dataFreq);	
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
				}				
			}else if('R' == sCommand[i]){			
				for(j=0;j<this.WIDTH_FREQ;j++)
				{
					m_pcmData = this.getFreqData(j,14700,0,this.WIDTH_FREQ,49,this.ENV_STEP);
					dataFreq[1] =  ((m_pcmData >> 8) & 0xff);
					dataFreq[0] =  ((m_pcmData) & 0xff);
        //			fout.write(dataFreq);	
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
				}				
				for(j=0;j<this.WIDTH_SPACE;j++)
				{
					m_pcmData = 0;
					dataFreq[1] = 0;
                    dataFreq[0] = 0;
                    this.wav[len++] = dataFreq[0];
                    this.wav[len++] = dataFreq[1];
		//			fout.write(dataFreq);	
				}
			}
			 
        }   
        
        
        //alert("len"+len);
        return len;
    }

}

