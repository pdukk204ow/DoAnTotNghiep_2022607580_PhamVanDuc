import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  checkingStatus: boolean = false;

  constructor(
    public cartService: CartService,
    private productService: ProductService
  ) {
    this.cartItems = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    this.checkProductsStatus();
  }

  checkProductsStatus(): void {
    if (!this.cartItems || this.cartItems.length === 0) {
      return;
    }
    this.checkingStatus = true;
    this.productService.getFreshProducts().subscribe({
      next: (activeProducts) => {
        const activeIds = new Set(activeProducts.map((p: any) => p.id));
        this.cartItems.forEach(item => {
          const isActive = activeIds.has(item.id);
          item.discontinued = !isActive;
          if (item.discontinued) {
            item.selected = false;
          }
        });
        this.cartService.saveCart();
        this.checkingStatus = false;
      },
      error: (err: any) => {
        console.error('Loi khi kiem tra trang thai san pham:', err);
        this.checkingStatus = false;
      }
    });
  }

  increase(item: any) {
    if (item.discontinued) return;
    item.quantity++;
    this.cartService.saveCart();
  }

  decrease(item: any) {
    if (item.discontinued) return;
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.saveCart();
    }
  }

  getSubtotal(): number {
    return this.cartItems
      .filter(item => item.selected && !item.discontinued)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    return subtotal > 0 ? subtotal + this.getShippingFee() : 0;
  }

  getShippingFee(): number {
    const selectedItems = this.cartItems.filter(
      item => item.selected && !item.discontinued
    );
    return selectedItems.length === 0 ? 0 : 20000;
  }

  hasNoValidSelection(): boolean {
    return this.cartItems.filter(item => item.selected && !item.discontinued).length === 0;
  }

  hasDiscontinuedItems(): boolean {
    return this.cartItems.some(item => item.discontinued);
  }

  removeItem(item: any) {
    this.cartService.removeItem(item);
    this.cartItems = this.cartService.getCartItems();
  }

  removeDiscontinuedItems(): void {
    this.cartItems = this.cartItems.filter(item => !item.discontinued);
    this.cartService.items = this.cartItems;
    this.cartService.saveCart();
  }

  onImgError(event: any) {
    event.target.src = '';
  }
}