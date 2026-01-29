import { Component, ChangeDetectionStrategy, inject, Signal, signal, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  templateUrl: './manage-orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CurrencyPipe, PaginationComponent]
})
export class ManageOrdersComponent {
  private orderService = inject(OrderService);
  private titleService = inject(Title);
  orders: Signal<Order[]> = this.orderService.orders;

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(5);

  // Computed values for pagination
  totalItems = computed(() => this.orders().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedOrders = computed(() => {
    const allOrders = this.orders();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return allOrders.slice(startIndex, endIndex);
  });

  readonly orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Cancelled'];

  constructor() {
    this.titleService.setTitle('MirTechHub - Admin: Manage Orders');
  }

  onStatusChange(order: Order, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as OrderStatus;
    this.orderService.updateOrderStatus(order.id, newStatus);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
