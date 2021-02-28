import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Http, HttpModule, RequestOptions, Headers } from "@angular/http";
import { map, tap, switchMap } from 'rxjs/operators';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  // url: string = 'http://indiatopconsumercare.com/savingsbox/';
  url: string = 'http://thesavingsbox.com/api/';


  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    let headers = new HttpHeaders();
    headers.append( 'Access-Control-Allow-Origin', '*',)
    headers.append( 'Content-Type', 'application/json')
    return this.http.post(this.url+ endpoint, body, {headers:headers});
  }
 
  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }
  getCard(endpoint,data)
  {
    return this.http.post(this.url+endpoint,data)
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
  // list(endpoint:string, data:object){
  //   const headers = new Headers();
  //   headers.append('Authorization', 'Bearer ' + data['token']);
  //   headers.append('Accept', 'application/json');
  //   headers.append('Content-Type', 'application/json');
  //   const options = new RequestOptions({ headers: headers });
  //   return this.Http.post(this.url + endpoint,{ phone: data['phone'],token:data['token']},options
  //   )
  //   .pipe(tap(resData=>{
  //     return resData;      
  //    }));
  // }
}
