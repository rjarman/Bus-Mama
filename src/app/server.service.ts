import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL } from 'src/app/config';


@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private httpClient: HttpClient) { }

  getUserData() {
    return this.httpClient.get(
      URL.chat,
      {observe: 'response', params: new HttpParams().append('email', 'sss@gmail.com')});
  }

  getBusData() {
    return this.httpClient.get(
      URL.list,
      {observe: 'response'}
    );
  }
}
