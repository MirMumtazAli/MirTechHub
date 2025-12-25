import { Component, OnInit } from '@angular/core';
import { Order } from '../../core/models/order';
import { OrderService } from '../../core/services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  userId = 1; // replace with logged-in user ID

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders() {
    this.orderService.getAll().subscribe(data => {
      this.orders = data.filter(o => o.userId === this.userId);
    });
  }

  cancelOrder(id: number) {
    this.orderService.cancel(id).subscribe(() => this.loadUserOrders());
  }
}
