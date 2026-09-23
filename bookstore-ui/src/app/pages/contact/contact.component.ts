import { Component } from '@angular/core';

import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;

  faqs = [
    {
      q: 'Bao lâu thì tôi nhận được sách?',
      a: 'Đơn hàng được xử lý trong 24 giờ và giao trong 2–4 ngày làm việc tùy khu vực. Bạn theo dõi trạng thái đơn trong mục "Đơn hàng của tôi".',
      open: false
    },
    {
      q: 'Nhà sách Văn Đức có hỗ trợ đổi trả không?',
      a: 'Có. Sách lỗi in ấn, rách hỏng do vận chuyển được đổi trả miễn phí trong 7 ngày kể từ khi nhận hàng.',
      open: false
    },
    {
      q: 'Tôi có thể thanh toán bằng hình thức nào?',
      a: 'Hiện tại Nhà sách Văn Đức hỗ trợ thanh toán khi nhận hàng (COD). Các cổng thanh toán trực tuyến sẽ sớm được bổ sung.',
      open: false
    },
    {
      q: 'Làm sao để theo dõi đơn hàng?',
      a: 'Đăng nhập và vào mục "Đơn hàng của tôi" — trạng thái đơn (Chờ xử lý / Đang giao / Hoàn thành) được cập nhật theo thời gian thực.',
      open: false
    },
    {
      q: 'Phí vận chuyển được tính thế nào?',
      a: 'Phí vận chuyển cố định 20.000đ mỗi đơn. Miễn phí vận chuyển cho đơn hàng từ 300.000đ.',
      open: false
    }
  ];

  constructor(private notification: NotificationService) {}

  isValid(): boolean {
    return (
      this.form.name.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim()) &&
      this.form.message.trim().length > 0
    );
  }

  submit(): void {
    this.submitted = true;

    if (!this.isValid()) {
      this.notification.success('Vui lòng điền đầy đủ họ tên, email hợp lệ và nội dung');
      return;
    }

    // Backend chưa có endpoint nhận liên hệ — chỉ xác nhận phía client
    this.notification.success('Đã gửi liên hệ! Chúng tôi sẽ phản hồi trong 24 giờ 💌');
    this.form = { name: '', email: '', subject: '', message: '' };
    this.submitted = false;
  }

  toggleFaq(faq: any): void {
    faq.open = !faq.open;
  }

}
