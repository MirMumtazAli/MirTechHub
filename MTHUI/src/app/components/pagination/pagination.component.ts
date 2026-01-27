
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalItems = input.required<number>();
  itemsPerPage = input.required<number>();

  pageChange = output<number>();

  startItem = computed(() => (this.currentPage() - 1) * this.itemsPerPage() + 1);
  endItem = computed(() => Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems()));

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages()) {
      this.pageChange.emit(newPage);
    }
  }
}
