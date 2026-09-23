import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name = '';

  email = '';

  password = '';

  confirmPassword = '';

  phone = '';

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  register() {

    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {

      this.errorMessage = 'Mật khẩu không khớp';

      return;

    }

    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone
    };

    this.authService.register(user).subscribe(result => {

      if (!result.success) {

        this.errorMessage = result.error!;

        return;

      }

      this.notification.success('Đăng ký thành công 😄');

      this.router.navigate(['/login']);

    });

  }

}