import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from '../../common/ChatMessage';
import { Customer } from '../../common/Customer';
import { Order } from '../../common/Order';
import { Statistical } from '../../common/Statistical';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { PageService } from '../../services/page.service';
import { StatisticalService } from '../../services/statistical.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orderHandle!: number;
  customerLength!: number;
  orders!: Order[];
  customers!: Customer[];

  statistical!: Statistical[];
  labels: string[] = [];
  data: number[] = [];
  year: number = 2021;
  myChartBar !: Chart;
  countYears!: number[];

  revenueYearNow!: number;
  revenueMonthNow!: number;

  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  constructor(private pageService: PageService, private toastr: ToastrService, private orderService: OrderService, private customerService: CustomerService, private statisticalService: StatisticalService) { }

  ngOnInit(): void {
    this.openWebSocket();
    this.pageService.setPageActive('dashboard');
    this.getAllOrder();
    this.getAllCustomer();
    this.getStatisticalYear();
    this.getCountYear();
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  getStatisticalYear() {
    this.statisticalService.getByMothOfYear(this.year).subscribe(data => {
      this.statistical = data as Statistical[];
      this.statistical.forEach(item => {
        this.labels.push('Tháng ' + item.month);
        this.data.push(item.amount);
      })
      this.loadChartBar();
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getCountYear() {
    this.statisticalService.getCountYear().subscribe(data => {
      this.countYears = data as number[];
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getRevenueYear(year: number): number {
    let revenue = 0
    for (let i = 0; i < this.orders.length; i++) {
      if (new Date(this.orders[i].orderDate).getFullYear() == year && this.orders[i].status == 2) {
        revenue += this.orders[i].amount;
      }
    }
    return revenue;
  }

  getRevenueYearNow(): number {
    let revenue = 0
    for (let i = 0; i < this.orders.length; i++) {
      if (new Date(this.orders[i].orderDate).getFullYear() == new Date().getFullYear() && this.orders[i].status == 2) {
        revenue += this.orders[i].amount;
      }
    }
    return revenue;
  }

  getRevenueMonthNow(): number {
    let revenue = 0
    for (let i = 0; i < this.orders.length; i++) {
      if (new Date(this.orders[i].orderDate).getMonth() == new Date().getMonth() && new Date(this.orders[i].orderDate).getFullYear() == new Date().getFullYear() && this.orders[i].status == 2) {
        revenue += this.orders[i].amount;
      }
    }
    return revenue;
  }

  getAllOrder() {
    this.orderService.get().subscribe(data => {
      this.orders = data as Order[];
      this.orderHandle = 0;
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].status == 0) {
          this.orderHandle++;
        }
      }
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  getAllCustomer() {
    this.customerService.getAll().subscribe(data => {
      this.customers = data as Customer[];
      this.customerLength = this.customers.length;
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  setYear(year: number) {
    this.year = year;
    this.labels = [];
    this.data = [];
    this.myChartBar.destroy();
    this.ngOnInit();
  }

  loadChartBar() {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Doanh thu (VND)',
          data: this.data,
          backgroundColor: 'rgba(5, 150, 105, 0.75)',
          hoverBackgroundColor: 'rgba(5, 150, 105, 0.95)',
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: '#64748b'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: '#64748b',
              callback: (value: any) => value.toLocaleString('vi-VN') + ' ₫'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: 'Plus Jakarta Sans', size: 12 },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            callbacks: {
              label: (context: any) => ' Doanh thu: ' + Number(context.raw).toLocaleString('vi-VN') + ' ₫'
            }
          }
        }
      }
    });
  }

  openWebSocket() {
    this.webSocket = new WebSocket(environment.wsUrl);

    this.webSocket.onopen = (event) => {
      // console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      this.getAllOrder();
    };

    this.webSocket.onclose = (event) => {
      // console.log('Close: ', event);
    };
  }

  closeWebSocket() {
    this.webSocket.close();
  }

}
