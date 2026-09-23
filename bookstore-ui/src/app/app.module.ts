import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Book,
  Tag,
  Minus,
  Plus,
  X
} from 'lucide-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SearchComponent } from './pages/search/search.component';
import { ToastComponent } from './shared/toast/toast.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CategoryComponent } from './pages/category/category.component';
import { BooksComponent } from './pages/books/books.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductDetailComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent,
    HeaderComponent,
    ProductCardComponent,
    ProfileComponent,
    OrdersComponent,
    SearchComponent,
    ToastComponent,
    WishlistComponent,
    CategoryComponent,
    BooksComponent,
    AboutComponent,
    ContactComponent,
    AiAssistantComponent,
    PaymentResultComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Truck,
      ShieldCheck,
      RefreshCcw,
      Headphones,
      Search,
      ShoppingCart,
      Heart,
      User,
      ChevronLeft,
      ChevronRight,
      ChevronDown,
      Clock,
      Book,
      Tag,
      Minus,
      Plus,
      X
    }),
  ],

  providers: [],

  bootstrap: [AppComponent]
})

export class AppModule { }
