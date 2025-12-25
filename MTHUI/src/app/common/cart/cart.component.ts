import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../core/models/cart-item';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getAll().subscribe(data => this.cartItems = data);
  }

  addToCart(item: CartItem) {
    this.cartService.add(item).subscribe(() => this.loadCart());
  }

  updateCartItem(item: CartItem) {
    if (!item.id) return;
    this.cartService.update(item.id, item).subscribe(() => this.loadCart());
  }

  removeCartItem(id: number) {
    this.cartService.remove(id).subscribe(() => this.loadCart());
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
