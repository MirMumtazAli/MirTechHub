import { Component, OnInit } from '@angular/core';
import { Order } from '../../core/models/order';
import { OrderService } from '../../core/services/order.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAll().subscribe(data => this.orders = data);
  }

  updateOrder(order: Order) {
    this.orderService.update(order.id, order).subscribe(() => this.loadOrders());
  }

  cancelOrder(id: number) {
    this.orderService.cancel(id).subscribe(() => this.loadOrders());
  }

  deleteOrder(id: number) {
    this.orderService.delete(id).subscribe(() => this.loadOrders());
  }
}
