import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/**
 * Server-side order service.
 * Flow: get Cart backend -> update address/phone -> push CartDetails -> POST /api/orders/{email}
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  statusLabel(status: number): string {
    switch (status) {
      case 0: return 'Ch\u1edd x\u1eed l\u00fd';
      case 1: return '\u0110ang giao';
      case 2: return 'Ho\u00e0n th\u00e0nh';
      case 3: return '\u0110\u00e3 h\u1ee7y';
      default: return 'Kh\u00f4ng r\u00f5';
    }
  }

  /** Order history with items for a user. */
  getOrders(email: string): Observable<any[]> {

    return this.http.get<any[]>(this.api + '/api/orders/user/' + email).pipe(
      switchMap(orders => {

        if (!orders || orders.length === 0) {
          return of([]);
        }

        const withItems = orders.map(o =>
          this.http.get<any[]>(this.api + '/api/orderDetail/order/' + o.ordersId).pipe(
            map(details => this.mapOrder(o, details))
          )
        );

        return forkJoin(withItems);

      })
    );

  }

  /**
   * Place order with optional payment method.
   * paymentMethod: 0 = COD (default), 1 = VNPay
   */
  placeOrder(
    email: string,
    street: string,
    phone: string,
    items: any[],
    paymentMethod: number = 0,
    discount: number = 0
  ): Observable<any> {

    return this.http.get<any>(this.api + '/api/cart/user/' + email).pipe(
      switchMap(cart => {

        cart.address = street;
        cart.phone = phone;
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * i.quantity, 0
        );
        cart.amount = Math.max(0, subtotal - discount);

        return this.http
          .put<any>(this.api + '/api/cart/user/' + email, cart)
          .pipe(map(() => cart));

      }),
      switchMap(cart => {

        const pushes = items.map(i =>
          this.http.post(this.api + '/api/cartDetail', {
            quantity: i.quantity,
            price: Number(i.price) * i.quantity,
            product: { productId: i.id },
            cart: { cartId: cart.cartId }
          })
        );

        return forkJoin(pushes).pipe(map(() => cart));

      }),
      switchMap(cart =>
        this.http.post(this.api + '/api/orders/' + email + '?paymentMethod=' + paymentMethod, cart)
      )
    );

  }

  /** Map backend order to frontend shape. */
  
  /** Cancel an order (only when status = 0: pending). */
  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(this.api + '/api/orders/cancel/' + orderId, {});
  }

  private mapOrder(o: any, details: any[]): any {
    return {
      id: o.ordersId,
      date: o.orderDate,
      total: o.amount,
      status: this.statusLabel(o.status),
      statusCode: o.status,
      paymentMethod: o.paymentMethod,
      shippingAddress: {
        label: '',
        name: o.user ? o.user.name : '',
        phone: o.phone,
        street: o.address
      },
      items: (details || []).map(d => ({
        image: d.product ? d.product.image : '',
        name: d.product ? d.product.name : '',
        quantity: d.quantity,
        price: d.price
      }))
    };
  }

}


