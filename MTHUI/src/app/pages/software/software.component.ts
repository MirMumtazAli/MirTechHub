import { Component, ChangeDetectionStrategy, inject, Signal, computed, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';

@Component({
  selector: 'app-software',
  standalone: true,
  templateUrl: './software.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, PaginationComponent, ProductCardSkeletonComponent]
})
export class SoftwareComponent {
  private productService = inject(ProductService);
  private titleService = inject(Title);
  private allSoftware: Signal<Product[]> = computed(() =>
    this.productService.getSoftware()().filter(p => !p.isDeleted)
  );

  isLoading = this.productService.getSoftwareLoading();
  searchTerm = signal('');

  constructor() {
    this.titleService.setTitle('MirTechHub - Software');
  }

  filteredSoftware = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allSoftware();
    }
    return this.allSoftware().filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  });

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(8);

  // Computed values for pagination
  totalItems = computed(() => this.filteredSoftware().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedSoftware = computed(() => {
    const software = this.filteredSoftware();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return software.slice(startIndex, endIndex);
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset to first page on new search
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
