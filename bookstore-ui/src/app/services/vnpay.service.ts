import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VnpayService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Call backend to create VNPay payment URL for a given order.
   * Returns { paymentUrl: string }
   */
  createPayment(orderId: number): Observable<{ paymentUrl: string }> {
    return this.http.get<{ paymentUrl: string }>(
      this.api + '/api/vnpay/create-payment/' + orderId
    );
  }

  /**
   * Call backend to verify VNPay payment result.
   * Pass the raw query string from VNPay redirect.
   */
  getPaymentInfo(queryString: string): Observable<any> {
    return this.http.get<any>(
      this.api + '/api/vnpay/payment-info?' + queryString
    );
  }
}
