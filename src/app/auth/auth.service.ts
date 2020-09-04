import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private _isUserLogin = false;


  constructor(private route: Router, private cookieService: CookieService) { }

  isUserLogin(){
    if(this.cookieService.get('_isUserLogin') === 'true') {
      return true;
    }
    return false;
  }

  login() {
    this.cookieService.set('_isUserLogin', 'true');
    // this._isUserLogin = true;
    this.route.navigateByUrl('/');
  }

  logout() {
    this.cookieService.delete('_isUserLogin');
    console.log('jhfgjgj');
    // this._isUserLogin = false;
    this.route.navigateByUrl('/auth');
  }
}
