import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { Product } from '../../common/Product';
import { PageService } from '../../services/page.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-soldest',
  templateUrl: './soldest.component.html',
  styleUrls: ['./soldest.component.css']
})
export class SoldestComponent implements OnInit {

  listData!: MatTableDataSource<Product>;
  products!: Product[];
  productsLength!: number;
  columns: string[] = ['image', 'productId', 'name', 'sold', 'category'];

  labels: string[] = [];
  data: number[] = [];
  myChartBar !: Chart;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private productService: ProductService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('soldest');
    this.getProduct();
    Chart.register(...registerables);
  }

  getProduct() {
    this.productService.getBestSeller().subscribe(data => {
      this.products = data as Product[];
      this.listData = new MatTableDataSource(this.products);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.labels = [];
      this.data = [];
      const topCount = Math.min(this.products.length, 10);
      for (let i = 0; i < topCount; i++) {
        const item = this.products[i];
        const shortName = item.name.length > 24 ? item.name.substring(0, 24) + '...' : item.name;
        this.labels.push(shortName);
        this.data.push(item.sold);
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
          label: 'Số lượng bán',
          data: this.data,
          backgroundColor: [
            'rgba(16, 185, 129, 0.85)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(16, 185, 129, 0.65)',
            'rgba(59, 130, 246, 0.75)',
            'rgba(59, 130, 246, 0.65)',
            'rgba(59, 130, 246, 0.55)',
            'rgba(99, 102, 241, 0.65)',
            'rgba(99, 102, 241, 0.55)',
            'rgba(139, 92, 246, 0.55)',
            'rgba(148, 163, 184, 0.55)'
          ],
          borderColor: [
            '#10b981',
            '#10b981',
            '#10b981',
            '#3b82f6',
            '#3b82f6',
            '#3b82f6',
            '#6366f1',
            '#6366f1',
            '#8b5cf6',
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
              label: (context: any) => ` Đã bán: ${context.raw} cuốn`
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
