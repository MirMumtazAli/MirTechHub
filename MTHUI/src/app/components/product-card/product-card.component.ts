import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe, RouterLink]
})
export class ProductCardComponent {
  product = input.required<Product>();
  private cartService = inject(CartService);

  addToCart() {
    this.cartService.handleAddToCart(this.product());
  }
}
