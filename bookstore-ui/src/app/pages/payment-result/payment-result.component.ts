import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VnpayService } from 'src/app/services/vnpay.service';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit {

  loading = true;
  success = false;
  message = '';

  txnRef = '';
  amount = 0;
  orderInfo = '';
  transactionNo = '';
  bankCode = '';
  payDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vnpayService: VnpayService
  ) {}

  ngOnInit(): void {
    // Get the raw query string from the URL (VNPay redirect params)
    const queryString = window.location.search.substring(1);

    if (!queryString) {
      this.loading = false;
      this.success = false;
      this.message = 'Không tìm thấy thông tin thanh toán';
      return;
    }

    this.vnpayService.getPaymentInfo(queryString).subscribe(
      (res) => {
        this.loading = false;
        this.success = res.status === 'SUCCESS';
        this.message = res.message || '';
        this.txnRef = res.txnRef || '';
        this.amount = res.amount || 0;
        this.orderInfo = res.orderInfo || '';
        this.transactionNo = res.transactionNo || '';
        this.bankCode = res.bankCode || '';
        this.payDate = res.payDate || '';
      },
      () => {
        this.loading = false;
        this.success = false;
        this.message = 'Không thể xác minh thanh toán. Vui lòng thử lại.';
      }
    );
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}