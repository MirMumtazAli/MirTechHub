import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe]
})
export class CartComponent {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  notificationService = inject(NotificationService);
  router: Router = inject(Router);
  private titleService = inject(Title);

  cartItems = this.cartService.items;
  totalPrice = this.cartService.totalPrice;

  constructor() {
    this.titleService.setTitle('MirTechHub - Cart');
  }

  removeItem(product: Product) {
    this.cartService.removeItem(product);
  }

  checkout() {
    this.orderService.createOrder(this.cartItems());
    this.cartService.clearCart();
    this.notificationService.show('Your order has been placed successfully!');
    this.router.navigate(['/orders']);
  }
}
