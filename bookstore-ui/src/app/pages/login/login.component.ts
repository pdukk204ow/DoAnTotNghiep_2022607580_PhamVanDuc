import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';

  password = '';

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  login() {

    this.errorMessage = '';

    this.authService
      .login(this.email, this.password)
      .subscribe(success => {

        if (success) {

          this.notification.success(
            'Đăng nhập thành công 😄'
          );

          this.router.navigate(['/']);

        } else {

          this.errorMessage =
            'Sai tài khoản hoặc mật khẩu';

        }

      });

  }

}