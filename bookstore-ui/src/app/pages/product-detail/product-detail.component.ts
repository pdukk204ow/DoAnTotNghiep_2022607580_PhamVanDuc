import { Component, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ProductService } from 'src/app/services/product.service';

import { CartService } from 'src/app/services/cart.service';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product: any;

  reviews: any[] = [];

  relatedBooks: any[] = [];

  // Số lượng mua (stepper)
  qty = 1;

  // Phân trang đánh giá
  visibleReviewCount = 5;

  // Form state
  reviewContent = '';
  reviewRating = 0;
  hoverRating = 0;

  // Whether the current user already has a review (edit mode)
  isEditing = false;

  readonly stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private reviewService: ReviewService,
    public authService: AuthService,
    private notification: NotificationService,
    public wishlistService: WishlistService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    // Subscribe paramMap (không dùng snapshot) để bấm "sách cùng thể loại"
    // điều hướng sang sản phẩm khác vẫn nạp lại dữ liệu (component được tái sử dụng)
    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      this.resetState();

      this.productService.getProduct(id).subscribe(product => {

        this.product = product;

        if (!this.product) {
          this.router.navigate(['/']);
          return;
        }

        this.loadReviews();
        this.loadUserReview();
        this.loadRelatedBooks();

      });

    });

    // Cache rates tải bất đồng bộ — đồng bộ lại danh sách review khi sẵn sàng
    this.reviewService.changes$.subscribe(() => {
      if (this.product) {
        this.loadReviews();
        if (!this.isEditing) {
          this.loadUserReview();
        }
      }
    });

  }

  /** Trạng thái theo từng sản phẩm — phải xóa khi đổi sang sản phẩm khác */
  private resetState(): void {
    this.qty = 1;
    this.visibleReviewCount = 5;
    this.reviewContent = '';
    this.reviewRating = 0;
    this.hoverRating = 0;
    this.isEditing = false;
    this.relatedBooks = [];
    window.scrollTo({ top: 0 });
  }

  private loadRelatedBooks(): void {

    if (!this.product.categoryId) {
      return;
    }

    this.productService
      .getProductsByCategory(this.product.categoryId)
      .subscribe(list => {
        this.relatedBooks = list
          .filter(p => p.id !== this.product.id)
          .slice(0, 8);
      });

  }

  loadReviews(): void {
    this.reviews = this.reviewService.getReviews(this.product.id);
  }

  private loadUserReview(): void {

    if (!this.authService.isLoggedIn()) {
      return;
    }

    const existing = this.reviewService.getUserReview(
      this.product.id,
      this.authService.currentUser.email
    );

    if (existing) {
      this.reviewContent = existing.content;
      this.reviewRating  = existing.rating;
      this.isEditing     = true;
    }

  }

  // ---- wishlist ----

  get isWishlisted(): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    return this.wishlistService.isInWishlist(
      this.authService.currentUser.email,
      this.product.id
    );
  }

  toggleWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.notification.success('Vui lòng đăng nhập để lưu sản phẩm yêu thích');
      this.router.navigate(['/login']);
      return;
    }

    const added = this.wishlistService.toggleWishlist(
      this.authService.currentUser.email,
      this.product.id
    );

    this.notification.success(
      added ? 'Đã thêm vào danh sách yêu thích ♥' : 'Đã xóa khỏi danh sách yêu thích'
    );
  }

  // ---- star picker helpers ----

  setRating(star: number): void {
    this.reviewRating = star;
  }

  setHover(star: number): void {
    this.hoverRating = star;
  }

  clearHover(): void {
    this.hoverRating = 0;
  }

  starClass(star: number): string {

    const active = this.hoverRating
      ? star <= this.hoverRating
      : star <= this.reviewRating;

    return active ? 'star on' : 'star';

  }

  // ---- computed display values ----

  get averageRating(): number {
    return this.reviewService.getAverageRating(this.product.id);
  }

  get reviewCount(): number {
    return this.reviews.length;
  }

  get visibleReviews(): any[] {
    return this.reviews.slice(0, this.visibleReviewCount);
  }

  showMoreReviews(): void {
    this.visibleReviewCount += 5;
  }

  // ---- quantity stepper ----

  /** Trần số lượng = tồn kho backend (product.quantity); không có thì 99 */
  private get maxQty(): number {
    return this.product && this.product.quantity > 0 ? this.product.quantity : 99;
  }

  increaseQty(): void {
    if (this.qty < this.maxQty) {
      this.qty++;
    }
  }

  decreaseQty(): void {
    if (this.qty > 1) {
      this.qty--;
    }
  }

  displayStars(rating: number): string {
    const full  = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  // ---- actions ----

  addReview(): void {

    if (!this.authService.isLoggedIn()) {
      this.notification.success('Vui lòng đăng nhập để đánh giá 😄');
      this.router.navigate(['/login']);
      return;
    }

    if (this.reviewRating === 0) {
      this.notification.success('Vui lòng chọn số sao 😄');
      return;
    }

    if (!this.reviewContent.trim()) {
      this.notification.success('Vui lòng nhập nội dung đánh giá');
      return;
    }

    const user = this.authService.currentUser;
    const wasEditing = this.isEditing;

    this.reviewService
      .upsertReview(this.product.id, {
        userId:  user.userId,
        email:   user.email,
        name:    user.name,
        content: this.reviewContent.trim(),
        rating:  this.reviewRating
      })
      .subscribe(
        () => {

          this.isEditing     = true;
          this.reviewContent = this.reviewContent.trim();

          this.notification.success(
            wasEditing
              ? 'Cập nhật đánh giá thành công 😄'
              : 'Đánh giá đã được gửi 😄'
          );

        },
        () => {
          this.notification.success('Gửi đánh giá thất bại — thử lại sau');
        }
      );

  }

  addToCart(): void {

    if (!this.authService.isLoggedIn()) {
      this.notification.success('Vui lòng đăng nhập trước 😄');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.product, this.qty);
    this.notification.success('Đã thêm vào giỏ hàng 😄');

  }

  buyNow(): void {

    if (!this.authService.isLoggedIn()) {
      this.notification.success('Vui lòng đăng nhập trước 😄');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.setBuyNowItem(this.product, this.qty);
    this.router.navigate(['/checkout']);

  }

}
