import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import { AppConfig } from '../../app/app.config';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { removeSummaryDuplicates } from '@angular/compiler';

/**
 * Generated class for the LockRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@IonicPage()
@Component({
  selector: 'page-lock-record',
  templateUrl: 'lock-record.html',
})
export class LockRecordPage {
  @ViewChild(Content) content: Content;
  show : string = "0";   //0 关闭，1 显示
  items : any = [];
  database: SQLiteObject;
  pageSize: number = AppConfig.pageSize; //分页大小
  //pageSize: number = 10; //分页大小
  pageNumber: number  = 1; //分页页数
  loadingText:any =  false ;
  showScroll: boolean = true;
  find:any={
    userId:JSON.parse(localStorage.getItem("communityData")).userId,
    pageNumber:this.pageNumber,
    pageSize:this.pageSize
  };  //过滤条件
  constructor(private sqlite: SQLite,public httpSerProvider:HttpSerProvider,
    public popSerProvider:PopSerProvider,public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
      
  }

  ionViewDidLoad() {
    this.find.pageNumber = 1;
    this.loadData();
    
  }
  




  public initDB(){
    this.sqlite.create({
     name: 'data.db',
     location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('select * from record1 where userId='+ localStorage.getItem("userId")+' order by createTime desc',[])
      .then(res => {
        
        var arr = new Array(res.rows.length);
        
        for(var i = 0;i<res.rows.length;i++){
          arr[i] = res.rows.item(i);
          arr[i].createTime = parseInt(res.rows.item(i).createTime);
         
        }
        this.items = [];  
        this.items = arr;

      
        
      })
      .catch(e => console.log(e));
      this.database = db;
    });   
  }


  


  loadData(){
    this.initDB();
    //this.initDB2();
    // this.httpSerProvider.get('/home/findLockRecord',this.find).then((data: any) => {
    //   if (data.code === "0000") {
    //     this.items = PopSerProvider.copyObject(data.data);
    //   }
    // });

  }
  openSelect(){
    if(this.show=="0"){
      this.show="1";
    }else{
      this.show="0";
    }
    this.scrollTo();
  }

  openPage(page,i:any) {
    this.navCtrl.push(page,{item:i});
  }

  //页面滚动到底部
  scrollTo(){
    if(this.content.scrollTop > 0){
      this.show = '1';
    }
    this.content.scrollTo(0, 0, 300);
  }

  doInfinite(infiniteScroll) {
    //alert("asdf");
    this.find.pageNumber++;
    setTimeout(() => {
      this.httpSerProvider.get('/home/findLockRecord',this.find).then((data: any) => {
        if (data.code === "0000") {
          let tdata  = PopSerProvider.copyObject(data.data);
          for (var o in tdata) {
            this.items.push(tdata[o]);
          }
          let leng = this.items.length;
          if (leng == data['page'].totalCount) {
            this.showScroll = false;
            this.loadingText  = true;
            infiniteScroll.enable(false);
          }
        }
      });
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

}
