import { Component, ChangeDetectionStrategy, inject, Signal, computed, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  templateUrl: './notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, PaginationComponent, ProductCardSkeletonComponent]
})
export class NotesComponent {
  private productService = inject(ProductService);
  private titleService = inject(Title);
  private allNotes: Signal<Product[]> = computed(() =>
    this.productService.getNotes()().filter(p => !p.isDeleted)
  );

  isLoading = this.productService.getNotesLoading();
  searchTerm = signal('');

  constructor() {
    this.titleService.setTitle('MirTechHub - Notes');
  }

  filteredNotes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allNotes();
    }
    return this.allNotes().filter(note =>
      note.name.toLowerCase().includes(term) ||
      note.description?.toLowerCase().includes(term)
    );
  });

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(8); // 8 items per page for a 4-col grid

  // Computed values for pagination
  totalItems = computed(() => this.filteredNotes().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedNotes = computed(() => {
    const notes = this.filteredNotes();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return notes.slice(startIndex, endIndex);
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
