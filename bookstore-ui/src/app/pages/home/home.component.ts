import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  latestBooks: any[] = [];
  bestSellers: any[] = [];
  heroBooks: any[] = [];
  categories: any[] = [];

  loading = true;
  loadError = false;

  readonly skeletonItems = [1, 2, 3, 4, 5];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCatalog();

    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadCatalog(): void {
    this.loading = true;
    this.loadError = false;

    this.productService.getProducts().subscribe(
      products => {
        this.latestBooks = [...products]
          .sort((a, b) => b.id - a.id)
          .slice(0, 10);
        this.bestSellers = [...products]
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 10);
        this.heroBooks = this.bestSellers.slice(0, 10);
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.loadError = true;
      }
    );
  }

  retry(): void {
    this.productService.refresh();
    this.loadCatalog();
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }

  goToProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  @ViewChild('productSlider')
  productSlider!: ElementRef;

  @ViewChild('bestSellerSlider')
  bestSellerSlider!: ElementRef;

  @ViewChild('bookSlider')
  bookSlider!: ElementRef;

  bestSellerIndex = 0;
  productIndex = 0;
  currentIndex = 0;

  slideRight() {
    if (this.currentIndex < 4) {
      this.currentIndex++;
    }
    this.updateSlider();
  }

  slideLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.updateSlider();
  }

  updateSlider() {
    const offset = this.currentIndex * 1110;
    this.bookSlider.nativeElement.style.transform =
      `translateX(-${offset}px)`;
  }

  slideProductsRight() {
    if (this.productIndex < 1) {
      this.productIndex++;
    }
    this.updateProductSlider();
  }

  slideProductsLeft() {
    if (this.productIndex > 0) {
      this.productIndex--;
    }
    this.updateProductSlider();
  }

  updateProductSlider() {
    const offset = this.productIndex * 1320;
    this.productSlider.nativeElement.style.transform =
      `translateX(-${offset}px)`;
  }

  slideBestSellerRight() {
    if (this.bestSellerIndex < 2) {
      this.bestSellerIndex++;
    }
    this.updateBestSellerSlider();
  }

  slideBestSellerLeft() {
    if (this.bestSellerIndex > 0) {
      this.bestSellerIndex--;
    }
    this.updateBestSellerSlider();
  }

  updateBestSellerSlider() {
    const offset = this.bestSellerIndex * 1320;
    this.bestSellerSlider.nativeElement.style.transform =
      `translateX(-${offset}px)`;
  }
}
