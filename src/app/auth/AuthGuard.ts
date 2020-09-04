import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    constructor(private authService: AuthService, private route: Router){}

    canLoad(route: import("@angular/router").Route, segments: import("@angular/router").UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
        if(!this.authService.isUserLogin()){
            this.route.navigateByUrl('/auth');
        }
        // console.log(this.authService.isUserLogin);
        return this.authService.isUserLogin();
    }
}
