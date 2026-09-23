import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SearchComponent } from './pages/search/search.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CategoryComponent } from './pages/category/category.component';
import { BooksComponent } from './pages/books/books.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';

const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'books', component: BooksComponent, data: { mode: 'all' } },

  { path: 'books/new', component: BooksComponent, data: { mode: 'new' } },

  { path: 'books/bestseller', component: BooksComponent, data: { mode: 'bestseller' } },

  { path: 'books/sale', component: BooksComponent, data: { mode: 'sale' } },

  { path: 'about', component: AboutComponent },

  { path: 'contact', component: ContactComponent },

  { path: 'category/:id', component: CategoryComponent },

  { path: 'product/:id', component: ProductDetailComponent },

  { path: 'cart', component: CartComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'checkout', component: CheckoutComponent },

  { path: 'payment-result', component: PaymentResultComponent },

  { path: 'profile', component: ProfileComponent },

  { path: 'orders', component: OrdersComponent },

  { path: 'search', component: SearchComponent },

  { path: 'wishlist', component: WishlistComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        scrollPositionRestoration: 'top'
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
