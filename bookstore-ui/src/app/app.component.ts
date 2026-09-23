import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'bookstore-ui';

  constructor(private productService: ProductService) {}

 ngOnInit(): void {

  this.productService.getLasted().subscribe({

    next: (res: any) => {
      console.log('API OK:', res);
    },

    error: (err: any) => {
      console.log('API ERROR:', err);
    }

  });

}

  }

