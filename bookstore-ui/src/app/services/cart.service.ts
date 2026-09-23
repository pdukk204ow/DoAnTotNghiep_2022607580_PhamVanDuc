import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  buyNowItem: any = null;

  items: any[] = [];

  constructor() {

    const savedCart =
      localStorage.getItem('cart');

    if (savedCart) {

      this.items =
        JSON.parse(savedCart);

    }

  }

  saveCart() {

    localStorage.setItem(
      'cart',
      JSON.stringify(this.items)
    );

  }

  addToCart(product: any, qty: number = 1) {

    const existingItem =
      this.items.find(
        item => item.id === product.id
      );

    if (existingItem) {

      existingItem.quantity += qty;

    } else {

      this.items.push({

        ...product,

        quantity: qty,

        selected: true

      });

    }

    this.saveCart();

  }

  getCartItems() {

    return this.items;

  }

  removeItem(item: any) {

    this.items =
      this.items.filter(
        cartItem => cartItem !== item
      );

    this.saveCart();

  }

  getCartCount() {

  return this.items.reduce(

    (total, item) =>

      total + item.quantity,

    0

  );

}
setBuyNowItem(product: any, qty: number = 1) {

  this.buyNowItem = {

    ...product,

    quantity: qty,

    selected: true

  };

}

/** Bug #6: gọi khi rời /checkout để buy-now cũ không chiếm checkout lần sau */
clearBuyNowItem() {

  this.buyNowItem = null;

}
}