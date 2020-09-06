import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL } from 'src/app/config';
import { interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private httpClient: HttpClient) {}

  getUserData() {
    return this.httpClient.get(URL.chat, {
      observe: 'response',
      params: new HttpParams().append('email', 'sss@gmail.com'),
    });
  }

  getBusData() {
    return this.httpClient.get(URL.list, { observe: 'response' });
  }

  getBusDataInterval() {
    return interval(10000).pipe(
      flatMap(() => {
        return this.httpClient.get(URL.list, { observe: 'response' });
      })
    );
  }

  getTrackBusData(id: string) {
    return interval(10000).pipe(
      flatMap(() => {
        return this.httpClient.get(URL.list, {
          observe: 'response',
          params: new HttpParams().append('busId', id),
        });
      })
    );
  }
}
