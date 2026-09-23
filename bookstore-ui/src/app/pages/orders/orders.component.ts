import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: any[] = [];
  loading = true;
  private webSocket?: WebSocket;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchOrders();
    this.openWebSocket();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  fetchOrders(): void {
    if (!this.authService.currentUser?.email) {
      return;
    }

    this.orderService
      .getOrders(this.authService.currentUser.email)
      .subscribe(
        orders => {
          this.orders = orders;
          this.loading = false;
        },
        () => {
          this.orders = [];
          this.loading = false;
        }
      );
  }

  openWebSocket(): void {
    const wsUrl = environment.wsUrl || 'ws://localhost:8080/notification';
    try {
      this.webSocket = new WebSocket(wsUrl);

      this.webSocket.onmessage = () => {
        // Tự động load lại đơn hàng theo thời gian thực khi Admin chuyển trạng thái
        this.fetchOrders();
      };

      this.webSocket.onerror = () => {
        // Socket error fallback
      };
    } catch (e) {
      // ignore
    }
  }

  closeWebSocket(): void {
    if (this.webSocket) {
      try {
        this.webSocket.close();
      } catch (e) {}
    }
  }

  cancelOrder(orderId: number): void {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng #' + orderId + ' không?')) {
      return;
    }
    this.orderService.cancelOrder(orderId).subscribe(
      () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = this.orderService.statusLabel(3);
          order.statusCode = 3;
        }
        alert('Đơn hàng #' + orderId + ' đã được hủy thành công!');
      },
      () => {
        alert('Hủy đơn hàng thất bại. Vui lòng thử lại!');
      }
    );
  }
}
