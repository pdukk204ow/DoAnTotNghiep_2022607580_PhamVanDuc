import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId: number = 0;
  category: any = null;
  products: any[] = [];
  loading = true;
  error = '';

  readonly skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.categoryId = parseInt(params['id'], 10);

      if (!this.categoryId) {
        this.router.navigate(['/']);
        return;
      }

      this.loadCategory();
      this.loadProducts();

    });

  }

  retry(): void {
    this.loading = true;
    this.error = '';
    this.productService.refresh();
    this.loadCategory();
    this.loadProducts();
  }

  loadCategory(): void {

    this.categoryService.getOne(this.categoryId).subscribe(
      cat => {
        this.category = cat;
        this.loading = false;
      },
      err => {
        this.error = 'Không tìm thấy thể loại';
        this.loading = false;
      }
    );

  }

  loadProducts(): void {

    this.productService.getProductsByCategory(this.categoryId).subscribe(
      prods => {
        this.products = prods;
      },
      err => {
        this.error = 'Không tải được sản phẩm';
      }
    );

  }

}
