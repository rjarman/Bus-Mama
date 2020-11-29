import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { URL } from 'src/app/config';
import { LoginData } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerSubject = new Subject<any>();
  clearData = new Subject<boolean>();

  constructor(
    private route: Router,
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {
    this.registerSubject.subscribe((data) => {
      this.httpClient
        .post<{ status: string }>(
          URL.CHAT,
          data,
          { observe: 'response' }
        )
        .subscribe((res) => {
          if (res.body.status === 'ok') {
            this.clearData.next(true);
            this.cookieService.deleteAll();
            this.cookieService.set('_isUserLogin', 'true');
            this.cookieService.set(
              'email',
              data.get('email').toString()
            );
            // this._isUserLogin = true;
            this.route.navigateByUrl('/');
          } else {
            // toast
          }
        });
    });
  }

  isUserLogin() {
    if (this.cookieService.get('_isUserLogin') === 'true') {
      return true;
    }
    return false;
  }

  login(data: LoginData) {
    this.httpClient.post<{ status: string }>(
      URL.CHAT,
      { reqType: 'login', loginData: data },
      { observe: 'response' }
    ).subscribe((res) => {
      if (res.body.status === 'ok') {
        this.clearData.next(true);
        this.cookieService.deleteAll();
        this.cookieService.set('_isUserLogin', 'true');
        this.cookieService.set('email', data.email);
        // this._isUserLogin = true;
        this.route.navigateByUrl('/');
      } else {
        // toast
      }
    });
  }

  logout() {
    this.cookieService.deleteAll();
    this.route.navigateByUrl('/auth');
  }
}
