import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private authService = inject(AuthService);
  // FIX: Add explicit type to injected Router to resolve type inference issues.
  private router: Router = inject(Router);
  private notificationService = inject(NotificationService);

  readonly items = signal<Product[]>([]);
  readonly pendingItem = signal<Product | null>(null);

  readonly totalItems = computed(() => this.items().length);
  readonly totalPrice = computed(() => this.items().reduce((sum, item) => sum + item.price, 0));

  constructor() {
    effect(() => {
      // When user logs out (currentUser becomes null), clear the cart.
      if (!this.authService.currentUser()) {
        this.clearCart();
      }
    });
  }

  handleAddToCart(product: Product) {
    if (this.authService.currentUser()) {
      this.addItemToCart(product);
    } else {
      this.pendingItem.set(product);
      this.router.navigate(['/login']);
    }
  }

  addItemToCart(product: Product) {
    // First, check if the item is already in the cart to avoid duplicates.
    const isAlreadyInCart = this.items().some(item => item.id === product.id && item.type === product.type);

    if (isAlreadyInCart) {
      // If the item is already in the cart, show an informational/error notification and do nothing else.
      this.notificationService.show(`'${product.name}' is already in your cart.`, 'error');
      return;
    }

    // If the item is new, add it to the cart.
    this.items.update(currentItems => [...currentItems, product]);

    // Then, show a success notification.
    this.notificationService.show(`'${product.name}' added to cart!`);
  }

  removeItem(product: Product) {
    this.items.update(currentItems =>
      currentItems.filter(item => !(item.id === product.id && item.type === product.type))
    );
  }

  clearPendingItem() {
    this.pendingItem.set(null);
  }

  clearCart() {
    this.items.set([]);
  }
}
