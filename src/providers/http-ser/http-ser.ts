import { Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {APP_SERVE_URL} from '../../app/app.config';
// import {AppConfig} from '../../app/app.config';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';
import {NavController,App,Events} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * HTTP请求服务
 */
var ShowPage: any;

@Injectable()
export class HttpSerProvider {
    
    //@ViewChild('myNav') navCtrl: NavController; //
  
    showCount:boolean = false; //显示一次报错信息
    constructor(public http: Http,public app:App,public events:Events,public popSerProvider: PopSerProvider) {
        // console.log('Hello HttpSerProvider Provider');
        //this.navCtrl.setRoot('IndexPage');
        ShowPage = this;
        
       
    }

    get navCtrl(): NavController {
        return this.app.getRootNav();
    }

    getStatus(url:string, paramObj:any = {}) {
      
        
      
      
        return this.http.get(APP_SERVE_URL+url).toPromise()
            .then()
            .catch();
    }


    /**
     * get方式请求
     * @param {string} url     //url
     * @param paramObj      //json对象 如:{name:'大见',age:'23'}
     * @return {Promise<never | {}>}
     */
    get(url:string, paramObj:any = {}) {
        //let timestamp = Math.floor(new Date().getTime() / 1000 - 1420070400).toString();    //获取当前时间 减 2015年1月1日的 时间戳
        
        let headers = new Headers();
        headers.append('token', localStorage.getItem('token'));
        let options = new RequestOptions({headers: headers});
        //this.app.getRootNavs()[0].setRoot('IndexPage');
        return this.http.get(APP_SERVE_URL+url + this.toQueryString(paramObj),options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * post方式请求
     * @param {string} url
     * @param body       //如：paramObj:{name:'大见',age:'23'}
     * @param {string} contentType      //post请求的编码方式  application/x-www-form-urlencoded  multipart/form-data   application/json   text/xml
     * @return {Promise<never | {}>}
     */
    post(url:string, body:any = {}, contentType:string="application/json") {
        let headers = new Headers({'Content-Type':contentType});
        headers.append('token', localStorage.getItem('token'));
        let options = new RequestOptions({headers: headers});
       
        return this.http.post(APP_SERVE_URL+url, body,options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }



    /**
     * get请求参数处理
     *  对于get方法来说，都是把数据串联在请求的url后面作为参数，如果url中出现中文或其它特殊字符的话，很常见的一个乱码问题就要出现了
     *  url拼接完成后，浏览器会对url进行URL encode，然后发送给服务器，URL encode的过程就是把部分url做为字符，按照某种编码方式（如：utf-8,gbk等）编码成二进制的字节码
     * 不同的浏览器有不同的做法，中文版的浏览器一般会默认的使用GBK，通过设置浏览器也可以使用UTF-8，可能不同的用户就有不同的浏览器设置，也就造成不同的编码方式，
     * 所以通常做法都是先把url里面的中文或特殊字符用 javascript做URL encode，然后再拼接url提交数据，也就是替浏览器做了URL encode，好处就是网站可以统一get方法提交数据的编码方式。
     * @param obj　参数对象
     * @return {string}　参数字符串
     * @example
     *  声明: var obj= {'name':'大见',age:23};
     *  调用: toQueryString(obj);
     *  返回: "?name=%E5%B0%8F%E5%86%9B&age=23"
     */
    private toQueryString(obj) {
        let ret = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            let values = obj[key];
            if (values && values.constructor == Array) {//数组
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else { //字符串
                ret.push(this.toQueryPair(key, values));
            }
        }
        return '?' + ret.join('&');
    }

    /**
     *  post请求参数处理
     * @param obj
     * @return {string}
     *  声明: var obj= {'name':'大见',age:23};
     *  调用: toQueryString(obj);
     *  返回: "name=%E5%B0%8F%E5%86%9B&age=23"
     */
    // private toBodyString(obj) {
    //     let ret = [];
    //     for (let key in obj) {
    //         key = encodeURIComponent(key);
    //         // key = key;
    //         let values = obj[key];
    //         if (values && values.constructor == Array) {//数组
    //             let queryValues = [];
    //             for (let i = 0, len = values.length, value; i < len; i++) {
    //                 value = values[i];
    //                 queryValues.push(this.toQueryPair(key, value));
    //             }
    //             ret = ret.concat(queryValues);
    //         } else { //字符串
    //             ret.push(this.toQueryPair(key, values));
    //         }
    //     }
    //     return ret.join('&');
    // }

    private toQueryPair(key, value) {
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
        // return key + '=' +(value === null ? '' : String(value));
    }

    // private toSignPair(key, value) {
    //     return key + '=' + (value === null ? '' : String(value));
    // }

    private extractData(res:Response){
        let body = res.json();
      
        return body || {};
    }

    private handleError(error:Response | any) {
        let status = error.status;
        let message = "请求发生异常";
        
        //this.popSerProvider.toast(message);
        // if (status === 0) {
        //   message = "请求失败，请打开网络";
        // } else if (status === 404) {
        //   message = "请求失败，未找到请求地址";
        // } else if (status === 500) {
        //   message = "请求失败，服务器出错，请稍后再试";
        // } else if (status === 608) {

        //   message = "用户登录失效，请重新登录";
         
        //   sessionStorage.clear();
         
      
        // }else{
        
        // }
        //return error.message;
        
        
        

        let errMsg:string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            ShowPage.show(body);
            
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        
        
        
        //console.error(errMsg);
        return Promise.reject(errMsg);
    }




    private handleErrorStatus(error:Response | any) {
        let status = error.status;
        let message = "请求发生异常";
        
        //this.popSerProvider.toast(message);
        if (status === 0) {
          message = "请求失败，请打开网络";
        } else if (status === 404) {
          message = "请求失败，未找到请求地址";
        } else if (status === 500) {
          message = "请求失败，服务器出错，请稍后再试";
        } else if (status === 608) {

          message = "用户登录失效，请重新登录";

      
        }else{
        
        }
        return Promise.reject(message);
    } 

   //显示跳转界面和提示语（在handleError使用this.natCtrl无效，暂时无解2018-06-10）
   show(errMsg){
        //alert(errMsg);
        if(!this.showCount){
            this.popSerProvider.toast(errMsg.message);
            this.navCtrl.setRoot("IndexPage");    
            this.showCount = true;
        }
        
    }

    // private _requestFailed(endpoint: string, res, reqOpts?: any): void {
    //     this.nativeService.hideLoading();
    //     let status = res.status;
    
    //     let message = this.nativeService.getTranslateValue('request_exception');
    //     if (status === 0) {
    //       message = this.nativeService.getTranslateValue('request_response');
    //     } else if (status === 404) {
    //       message = this.nativeService.getTranslateValue('request_fail_address');
    //     } else if (status === 500) {
    //       message = this.nativeService.getTranslateValue('request_fail_server');
    //     } else if (status === 608) {
    //       message = this.nativeService.getTranslateValue('user_login_out');
    //       sessionStorage.clear();
    //       this.globalData.token = null;
    //       this.globalData.userInfo = null;
    //       // console.log('this.app.getActiveNavs=====', this.app.getActiveNavs()[0]);
    //       this.nativeService.showToast(message);
    //       this.app.getRootNavs()[0].setRoot('LoginPage');
    //       // let page = this.app.getActiveNavs()[0]['_root'];
    //       // return;
    //       // if (page !== 'LoginPage') {
    //       //   this.app.getActiveNavs()[0].setRoot('LoginPage');
    //       // }
    //       return;
    //     }
    //     // else if (status === 400) {
    //     //   return reject({ code: res.status, info: res, message });
    //     // }
    //     else {
    //       message = this.nativeService.getTranslateValue('request_error', { status: res.status, info: message });
    //     }
    //     this.nativeService.showToast(message);
    //   }



}
