import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product.model';
import { Order, OrderItem } from '../../models/order.model';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, CurrencyPipe, ConfirmDeleteComponent]
})
export class OrdersComponent {
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);
  orders = this.orderService.userOrders;

  isCancelModalOpen = signal(false);
  orderToCancel = signal<Order | null>(null);

  sendNoteByEmail(item: OrderItem) {
    // In a real app, this would call a backend service.
    // Here we just simulate the action.
    this.notificationService.show(`The note "${item.name}" has been sent to your registered email address.`);
  }

  requestCancelOrder(order: Order) {
    if (order.status !== 'Pending') {
      this.notificationService.show('Only pending orders can be cancelled.', 'error');
      return;
    }
    this.orderToCancel.set(order);
    this.isCancelModalOpen.set(true);
  }

  handleConfirmCancel() {
    const order = this.orderToCancel();
    if (order) {
      this.orderService.cancelOrder(order.id);
      this.notificationService.show(`Order #${order.id} has been cancelled.`);
    }
    this.handleCancelClose();
  }

  handleCancelClose() {
    this.isCancelModalOpen.set(false);
    this.orderToCancel.set(null);
  }
}
