import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, SafeHtmlPipe]
})
export class ProductCardComponent {
  product = input.required<Product>();
  private cartService = inject(CartService);
  private router = inject(Router);

  addToCart() {
    this.cartService.handleAddToCart(this.product());
  }

  navigateToDetails() {
    this.router.navigate(['/', this.product().type.toLowerCase(), this.product().id]);
  }
}
