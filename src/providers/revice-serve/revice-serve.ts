import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";


/*
  Generated class for the ReviceServeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReviceServeProvider {

  constructor(public http: Http) {}

  // 网络请求接口
  getHomeInfo(): Observable<Response> {
      return this.http.request('');
  }

  // 本地JSON文件请求
  getRequestContact() {
      return this.http.get("assets/js/city.json");
  }

}
