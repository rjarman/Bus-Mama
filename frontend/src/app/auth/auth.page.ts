import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { AuthService } from './auth.service';
import { URL } from 'src/app/config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  private profilePhoto: any;

  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });
  registerForm = this.formBuilder.group({
    userName: [''],
    email: [''],
    password: [''],
  });

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.authService.clearData.subscribe((status) => {
      if (status) {
        this.loginForm.reset();
        this.registerForm.reset();
      }
    });
  }

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

  setImages(event) {
    if (event.target.files.length > 0) {
      this.profilePhoto = event.target.files;
    }
  }

  register() {
    const tempFormData = new FormData();
    const img = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.profilePhoto.length; i++) {
      img.push(this.profilePhoto[i].name);
      tempFormData.append('images', this.profilePhoto[i]);
      tempFormData.append('imagePath', JSON.stringify(img));
    }
    tempFormData.append(
      'userName',
      JSON.stringify(this.registerForm.get('userName').value)
    );
    tempFormData.append(
      'email',
      JSON.stringify(this.registerForm.get('email').value)
    );
    tempFormData.append(
      'password',
      JSON.stringify(this.registerForm.get('password').value)
    );
    this.authService.registerSubject.next(tempFormData);
  }

  login() {
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.login(loginData);
  }
}
