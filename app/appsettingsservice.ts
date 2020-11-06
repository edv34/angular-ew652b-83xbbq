import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppSettings } from "./appsettings";
@Injectable()
export class AppSettingsService {
  constructor(private http: HttpClient) {
  }
  getSettings(): Observable<AppSettings> {  
    return this.http.get("/assets/appsettings.json")
      .map(this.extractData)
      .catch(this.handleErrors);
  }
  private extractData(res: Response) {
    console.log(res);
    let body = res.json();
    return body || {};
  }
  private handleErrors(error: any): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(error.message || error);
  }
} 