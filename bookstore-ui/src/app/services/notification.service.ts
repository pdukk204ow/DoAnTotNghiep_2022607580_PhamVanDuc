import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  message = '';

  visible = false;

  success(message: string) {

    this.message = message;

    this.visible = true;

    setTimeout(() => {

      this.visible = false;

    }, 1500);

  }

}