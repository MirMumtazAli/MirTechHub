import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Order, OrderStatus } from '../models/order.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { OrderCreateDto } from '../models/dto/order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = 'http://localhost:5121/api/orders';

  private readonly allOrders = signal<Order[]>([]);
  readonly orders = this.allOrders.asReadonly();

  readonly userOrders = computed(() => {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return [];
    return this.allOrders().filter(order => order.user.id === currentUser.id);
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        if(this.authService.isAdmin()) {
            this.loadAdminOrders();
        } else {
            this.loadUserOrders();
        }
      } else {
        this.allOrders.set([]);
      }
    });
  }

  private loadUserOrders() {
    this.http.get<Order[]>(this.baseUrl).subscribe(data => this.allOrders.set(data));
  }

  private loadAdminOrders() {
    this.http.get<Order[]>(`${this.baseUrl}/all`).subscribe(data => this.allOrders.set(data));
  }

  createOrder(cartItems: Product[]): void {
    if (cartItems.length === 0) return;

    const orderDto: OrderCreateDto = {
      items: cartItems.map(item => ({ productId: item.id, quantity: 1 }))
    };

    this.http.post<Order>(this.baseUrl, orderDto).pipe(
      tap(newOrder => {
        this.allOrders.update(currentOrders => [newOrder, ...currentOrders]);
      })
    ).subscribe();
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.http.put(`${this.baseUrl}/${orderId}/status`, { status }).pipe(
      tap(() => {
        this.allOrders.update(orders => orders.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
      })
    ).subscribe();
  }

  cancelOrder(orderId: string): void {
    this.http.put(`${this.baseUrl}/${orderId}/cancel`, {}).pipe(
      tap(() => {
        this.allOrders.update(orders =>
          orders.map(order => order.id === orderId ? { ...order, status: 'Cancelled' } : order)
        );
      })
    ).subscribe();
  }
}
