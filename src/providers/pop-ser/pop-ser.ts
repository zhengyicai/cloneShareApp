import {Injectable} from '@angular/core';
import {LoadingController, AlertController, ModalController, ToastController,Loading} from 'ionic-angular';

/*
  Generated class for the PopSerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/**
 *  遮罩层服务
 *
 */
declare var $: any;//Jquery对象
//declare var layer: any;//layer对象

@Injectable()
export class PopSerProvider {
    private load: any;
    private loadingShow: Loading;
    private loadingShow2:Loading;
    constructor(
               
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public toastCtrl: ToastController,
                public modalCtrl: ModalController) {
        console.log('PopSerProvider Provider');
    }


     /*======================验证===========================*/
    /**
    * 验证字符为空(true:为空|false:不为空)
    */
   static isEmpty(value:any): boolean {
    return value == null || typeof value === 'string' && $.trim(value).length === 0;
    }

    /**
    * 验证字符不能为空(true:不为空|false:为空)
    */
    static isNotEmpty(value:any): boolean {
        return !PopSerProvider.isEmpty(value);
    }

    /**
    * 手机号是否正确(true:正确|false:不正确)
    */
    static isMobile(value:any){
        return (/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(value));
    }

    /**
    * 邮箱是否正确(true:正确|false:不正确)
    */
    static isEmail(value:any){
        return ( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value));
    }

    /**
    * 验证是否是数字(true:是|false:否)
    */
    static isNumber(value:any){
        return !isNaN(value);
    }




     /**
    * 对象复制
    */
   static copyObject(value:any){
        var str = JSON.stringify(value);
        return JSON.parse(str);
    }
   
     /**
    * 格式状态
    * @param value
    * @returns {string}
    */
   formatState(value: string): string {
        return value == '10' ? '正常' : (value == '20' ? '禁用' : '');
    }

    /**
    * 日期格式化
    * @param value
    */
    formatDate(value: number,sformat:string){
        return this.dateFormat(new Date(value),sformat);
    }


    /**
    * 格式化日期
    * sFormat：日期格式:默认为yyyy-MM-dd     年：y，月：M，日：d，时：h，分：m，秒：s
    * @example  dateFormat(new Date(),'yyyy-MM-dd')   "2017-02-28"
    * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')   "2017-02-28 09:24:00"
    * @example  dateFormat(new Date(),'hh:mm')   "09:24"
    * @param date 日期
    * @param sFormat 格式化后的日期字符串
    * @returns {String}
    */
    dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
    Year: 0,
    TYear: '0',
    Month: 0,
    TMonth: '0',
    Day: 0,
    TDay: '0',
    Hour: 0,
    THour: '0',
    hour: 0,
    Thour: '0',
    Minute: 0,
    TMinute: '0',
    Second: 0,
    TSecond: '0',
    Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
    .replace(/yyy/ig, String(time.Year))
    .replace(/yy/ig, time.TYear)
    .replace(/y/ig, time.TYear)
    .replace(/MM/g, time.TMonth)
    .replace(/M/g, String(time.Month))
    .replace(/dd/ig, time.TDay)
    .replace(/d/ig, String(time.Day))
    .replace(/HH/g, time.THour)
    .replace(/H/g, String(time.Hour))
    .replace(/hh/g, time.Thour)
    .replace(/h/g, String(time.hour))
    .replace(/mm/g, time.TMinute)
    .replace(/m/g, String(time.Minute))
    .replace(/ss/ig, time.TSecond)
    .replace(/s/ig, String(time.Second))
    .replace(/fff/ig, String(time.Millisecond))
    }


    
    /**
     * alert弹窗
     * http://ionicframework.com/docs/api/components/alert/AlertController/
     */
    alert(content, callback = () => {
    }) {
        let alert = this.alertCtrl.create({
            title: '<span>提示</span>',
            message: '<div>' + content + '</div>',
            enableBackdropDismiss: false,
            cssClass: '',
            buttons: [
                {
                    text: "好的",
                    cssClass: 'pop_btn',
                    handler: () => {
                        if (callback != undefined && callback != null && typeof callback == 'function') {
                            callback();
                        }
                    }
                }]
        });
        alert.present();
    }

    /**
     * 自定义alert弹窗-
     */
    alertDIY(obj, ok_callback: any = () => {
    }) {
        let confirm_diy = this.alertCtrl.create({
            title: obj.title || '<div class="content_img">提示</div>',
            subTitle: obj.subTitle,
            message: obj.content,
            cssClass: obj.cssClass,
            enableBackdropDismiss: false,  //是否点击背景关闭弹窗
            buttons: [
                {
                    text: obj.okText || '确定',
                    cssClass: 'pop_btn',
                    handler: () => {
                        if (ok_callback != undefined && ok_callback != null && typeof ok_callback == 'function') {
                            ok_callback();
                        }
                    }
                }
            ]
        });
        confirm_diy.present();
    }

    /**
     * confirm确认框
     */
    confirm(content, ok_callback = () => {
    }) {
        let alert = this.alertCtrl.create({
            title: '<div class="content_img">提示</div>',
            subTitle: '',
            message: content,
            cssClass: '',
            enableBackdropDismiss: false,  //是否点击背景关闭弹窗
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    cssClass: 'pop_btn',
                    handler: () => {
                        if (ok_callback != undefined && ok_callback != null && typeof ok_callback == 'function') {
                            ok_callback();
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    /**
     * 自定义confirm确认框
     */
    confirmDIY(obj, esc_callback: any = () => {
    }, ok_callback: any = () => {
    }) {
        let confirm_diy = this.alertCtrl.create({
            title: obj.title || '<div class="content_img"><img  src="assets/img/use_over.png" class="img"/></div>',
            subTitle: obj.subTitle || '',
            cssClass: obj.cssClass || '',
            message: '<div>' + obj.content + '</div>',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: obj.escText || '取消',
                    handler: () => {
                        if (esc_callback != undefined && esc_callback != null && typeof esc_callback == 'function') {
                            esc_callback();
                        }
                    }
                },
                {
                    text: obj.okText || '确定',
                    cssClass: 'pop_btn',
                    handler: () => {
                        if (ok_callback != undefined && ok_callback != null && typeof ok_callback == 'function') {
                            ok_callback();
                        }
                    }
                }
            ]
        });
        confirm_diy.present();
    }

    /**
   * 此方法显示带图片loading
   * @param content 显示带图片的内容
   * @param status 1:操作成功，0:操作失败
   */
    showImgLoading(content: string = '操作成功', status: any = '1'): void {
        this.loadingShow = this.loadingCtrl.create({
        spinner: 'hide',
        content:
            status == '1'
            ? '<div><center style="background-color:green"><img src="assets/img/success.png"><br/><ion-label>' + content + '</ion-label></center></div>'
            : '<div><center style="background-color:green"><img src="assets/img/error.png"><br/><ion-label>' + content + '</ion-label></center></div>',
        duration: 1000,
        
        
        });
        this.loadingShow.present();
    }


    showSoundLoading(content: string = '播放中', status: any = '1'): void {
        this.loadingShow = this.loadingCtrl.create({
        spinner: 'hide',
        content:'<div><center style="background-color:green"><img src="assets/img/left_sound3.png"><br/><ion-label>' + content + '</ion-label></center></div>', 
        duration: status*1000,
          
        });
        this.loadingShow.present();
    }


    showSoundLoadingShow(content: string = '播放中'): void {
        this.loadingShow2 = this.loadingCtrl.create({
        spinner: 'hide',
        content:'<div><center style="background-color:green"><img src="assets/img/left_sound3.png"><br/><ion-label>' + content + '</ion-label></center></div>', 
        });
        this.loadingShow2.present();
    }
    showSoundLoadingHide(content: string = '播放中'): void {
       this.loadingShow2.dismiss();
    }
    





    /**
     * toast短暂提示   (支持自定义)
     * http://ionicframework.com/docs/api/components/toast/ToastController/
     * @param {string} content
     * @param {string} position    //"top", "middle", "bottom".
     * @param {string} cssClass
     * @param {number} duration
     */
    toast(content:string,position:string='bottom',cssClass:string='',duration:number=3000) {
        let toast = this.toastCtrl.create({
            message: content,
            duration: 3000,
            position: position,     //"top", "middle", "bottom".
            cssClass: cssClass,
            showCloseButton: false,
            closeButtonText: "关闭",
            dismissOnPageChange: false,     //当页面变化时是否dismiss
        });
        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        toast.present();
    }
    




    /**
     * 拨打号码弹窗
     */
    callPop(obj, esc_callback: any = () => {
    }, ok_callback: any = () => {
    }) {
        setTimeout(() => {//延迟几秒可以等html反应，这样获取的高度才准确
            let test = document.getElementsByClassName("pop_btn")[0];
            test.innerHTML = "<a href='tel:" + obj.tel + "'> 继续呼叫 </a>";
        }, 3);
        let confirm_diy = this.alertCtrl.create({
            title: obj.title || '<div class="content_img"><img  src="assets/img/use_over.png" class="img"/></div>',
            subTitle: obj.subTitle,
            cssClass: "call",
            message: '<div>' + obj.content + '</div>',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: obj.escText || '取消',
                    handler: () => {
                        if (esc_callback != undefined && esc_callback != null && typeof esc_callback == 'function') {
                            esc_callback();
                        }
                    }
                },
                {
                    text: obj.okText || '确定',
                    cssClass: 'pop_btn',
                    handler: () => {
                        if (ok_callback != undefined && ok_callback != null && typeof ok_callback == 'function') {
                            ok_callback();
                        }
                    }
                }
            ]
        });
        confirm_diy.present();
    }

    /**
     * loading加载动画
     * http://ionicframework.com/docs/api/components/loading/LoadingController/
     * @param {string} op       // 取值：open hide
     * @param {string} content
     * @param {string} spinner    动画SVG  // 取值：ios ios-small bubbles circles crescent dots
     * @param {string} css
     * @param {boolean} showBackdrop    是否有黑色遮罩
     */
    loading(op:string, content: string ='', spinner:string='ios-small',css: string='',showBackdrop:boolean=true) {
        if (op == 'hide') {
            if (this.load) {
                this.load.dismiss();
            }
        } else {
            this.load = this.loadingCtrl.create({
                spinner: spinner,
                content:content,
                cssClass: css,
                showBackdrop:showBackdrop,      //是否有黑色遮罩
                enableBackdropDismiss:false,
                dismissOnPageChange:false,
                // duration:3000
            });
            this.load.present();
            setTimeout(() => {
                this.load.dismiss();
            }, 10000);
        }
        this.load.onDidDismiss(() => {
            console.log('Dismissed loading');
        });
    }


}
