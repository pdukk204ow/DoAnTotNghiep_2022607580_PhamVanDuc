import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  bookCount = 0;
  categoryCount = 0;
  customerCount = 0;

  reasons = [
    {
      icon: '📚',
      title: 'Kho sách phong phú',
      text: 'Đầy đủ thể loại từ văn học, kinh tế đến thiếu nhi — tuyển chọn kỹ lưỡng từ các nhà xuất bản uy tín.'
    },
    {
      icon: '🚚',
      title: 'Giao hàng toàn quốc',
      text: 'Đóng gói cẩn thận, giao nhanh trong 2–4 ngày, miễn phí vận chuyển cho đơn từ 300.000đ.'
    },
    {
      icon: '💰',
      title: 'Giá tốt mỗi ngày',
      text: 'Khuyến mãi liên tục, giá luôn cạnh tranh — đọc sách hay không cần đắn đo về giá.'
    },
    {
      icon: '🤝',
      title: 'Tận tâm với bạn đọc',
      text: 'Đổi trả dễ dàng trong 7 ngày, hỗ trợ tư vấn chọn sách qua hotline và email.'
    }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Thống kê thật từ backend (sách + thể loại từ cache sẵn có, khách hàng chỉ lấy số lượng)
    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getAll(),
      users: this.http.get<any[]>(environment.apiUrl + '/api/auth')
    }).subscribe(
      ({ products, categories, users }) => {
        this.bookCount = products.length;
        this.categoryCount = categories.length;
        this.customerCount = users.length;
      },
      () => {
        // Backend chưa chạy: giữ 0, trang vẫn hiển thị nội dung tĩnh
      }
    );
  }

}
