import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { Product } from '../../common/Product';
import { PageService } from '../../services/page.service';
import { StatisticalService } from '../../services/statistical.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  listData!: MatTableDataSource<Product>;
  products!: Product[];
  productsLength!: number;
  columns: string[] = ['image', 'productId', 'name', 'quantity', 'category'];

  labels: string[] = [];
  data: number[] = [];
  myChartBar !: Chart;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private statisticalService: StatisticalService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('inventory');
    this.getAll();
    Chart.register(...registerables);
  }

  getAll() {
    this.statisticalService.getInventory().subscribe(data => {
      this.products = data as Product[];
      this.listData = new MatTableDataSource(this.products);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      for (let i = 0; i < 10; i++) {
        this.labels.push(this.products[i].name);
        this.data.push(this.products[i].quantity);
      }
      this.loadChartBar();
    }, error => {
      console.log(error);
    })
  }

  loadChartBar() {
    if (this.myChartBar) {
      this.myChartBar.destroy();
    }
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Số lượng tồn kho',
          data: this.data,
          backgroundColor: [
            'rgba(245, 158, 11, 0.85)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(245, 158, 11, 0.65)',
            'rgba(234, 88, 12, 0.75)',
            'rgba(234, 88, 12, 0.65)',
            'rgba(234, 88, 12, 0.55)',
            'rgba(239, 68, 68, 0.65)',
            'rgba(239, 68, 68, 0.55)',
            'rgba(244, 63, 94, 0.55)',
            'rgba(148, 163, 184, 0.55)'
          ],
          borderColor: [
            '#f59e0b',
            '#f59e0b',
            '#f59e0b',
            '#ea580c',
            '#ea580c',
            '#ea580c',
            '#ef4444',
            '#ef4444',
            '#f43f5e',
            '#94a3b8'
          ],
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
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
              label: (context: any) => ` Tồn kho: ${context.raw} cuốn`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: '#64748b'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: '#334155'
            }
          }
        }
      }
    });
  }

}
