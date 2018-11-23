import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,AlertController } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
import { ReviceServeProvider } from '../../providers/revice-serve/revice-serve';
/**
 * Generated class for the AddbankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addbank',
  templateUrl: 'addbank.html',
  providers: [ReviceServeProvider]
})
export class AddbankPage {

  constructor(private alertCtrl:AlertController, private reviceServe: ReviceServeProvider,private appCtrl: App,public navCtrl: NavController, public navParams: NavParams ,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider) {
  }

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
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePwdPage');
    this.getRequestContact();
  }



   //重复提交倒计时
verifyCode1: any = {
  countdown: AppConfig.requestTime,
  disable: true
}

getRequestContact() {
  this.reviceServe.getRequestContact().subscribe(res => {
      this.listData = res.json();
  }, error => {
      console.log(error);
  })
}


findArea(){
  
    var city =   this.area.split(" ");
    let person = {
      provinceCode:city[0],
      cityCode:city[1],
      areaCode:city[2]
    };
    this.httpSerProvider.post('/register/getCommunity',person).then((data:any)=>{
            if(data.code==='0000'){
              this.citylist = data.data;
             
            }else if(data.code==='9999'){
              this.popSerProvider.toast(data.message);
            }else{
              this.popSerProvider.toast(data.message);
              
            }
            // document.getElementById("test1").click();
            // this.findBuild();
            this.verifyCode1.countdown  = 1;
            this.verifyCode1.disable = true;

            this.subData.communityId = "";  
            this.subData.unitId = "";
            this.subData.buildingId = "";
            this.subData.roomName = "";
    });
    
}


findBuild(){
  //alert(this.subData.communityId);
  this.subData.unitId = "";
  this.subData.buildingId = "";
  this.subData.roomName = "";


  this.httpSerProvider.get('/register/getBuilding',{communityId:this.subData.communityId}).then((data:any)=>{
    if(data.code==='0000'){
      this.buildList = data.data;


      //this.listDatatest= this.buildList;
      // var array = [];
      // for(var i = 0;i<this.buildList.length;i++){
      //   var person ={
      //     value: this.buildList[i].id,
      //     text: this.buildList[i].buildingName
      //   }
      //   array.push(array);
       
       
      // }
      // this.listDatatest[0]={options:array};     
      // console.log(this.listDatatest);
    
    }else if(data.code==='9999'){
      this.popSerProvider.toast(data.message);
    }else{
      this.popSerProvider.toast(data.message);
      
    }
    this.verifyCode1.countdown  = 1;
    this.verifyCode1.disable = true;
});
    
}


findUnit(){
    this.unitList=[];
    this.roomList =[];
    this.subData.roomName ="";
    for(var i=0;i<this.buildList.length;i++){
      if(this.subData.buildingId == this.buildList[i].id){
          this.unitList = this.buildList[i].units;
          return;
      }
    }
    
}

findRoom(){
    this.roomList =[];
    this.subData.roomName ="";
    for(var i = 0 ;i<this.unitList.length;i++){
      
      if(this.subData.unitId == this.unitList[i].id){
       
         for(var j= 1;j<=this.unitList[i].floorNumber;j++){
              for(var k = 1;k<=this.unitList[i].roomNumber;k++){
                      if(k<10){
                        this.roomList.push(j+"0"+k);
                      }else{
                        this.roomList.push(j+""+k);
                      }
              }
         }
        
        return;
      }
    }
    
    
 

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



  gotoupdatePwd(){
       // console.log(this.subData);
      //alert(this.subData);
      if(this.addBankDefaultState){
        this.subData.isTrue = '10';
      }else{
        this.subData.isTrue = '20';
      }
        
      if(this.validator()){
        this.verifyCode1.disable = false;
        this.settime1();
        this.httpSerProvider.post('/register/addCommunity',this.subData).then((data:any)=>{
          if(data.code==='0000'){
            let alert = this.alertCtrl.create({
              title: "添加成功，等待管理员审核",
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
           
           // this.appCtrl.getActiveNav().pop();
           
          }else if(data.code==='9999'){
            this.popSerProvider.toast(data.message);
          }else{
            this.popSerProvider.toast(data.message);
            
          }
          this.verifyCode1.countdown  = 1;
          this.verifyCode1.disable = true;
        });
        
     }



  }
  //验证
  validator() {

  

    if (this.area == null || this.area == '') {
      this.popSerProvider.toast("所在城市不能为空");
      return false;
    }

    if (this.subData.communityId == null || this.subData.communityId == '') {
        this.popSerProvider.toast("小区不能为空");
        return false;
    }

    if (this.subData.buildingId == null || this.subData.buildingId == '') {
      this.popSerProvider.toast("楼栋不能为空");
      return false;
    }

    if (this.subData.unitId == null || this.subData.unitId == '') {
      this.popSerProvider.toast("单元不能为空");
      return false;
    }

    if (this.subData.roomName == null || this.subData.roomName == '') {
      this.popSerProvider.toast("房间不能为空");
      return false;
    }



    return true;
  }

}
