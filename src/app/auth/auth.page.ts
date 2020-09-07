import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onClickToggle() {
    $('.toggle').on('click', () => {
      $('.container').stop().addClass('active');
    });
  }

  onClickClose() {
    $('.close').on('click', () => {
      $('.container').stop().removeClass('active');
    });
  }

  register() {
    // if (this.registrationForm.valid){
    //
    // }
  }

  login() {
    this.authService.login();
  }
}
