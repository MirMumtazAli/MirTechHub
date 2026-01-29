import { Component, ChangeDetectionStrategy, inject, signal, Signal, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
import { ConfirmDeleteComponent } from '../../../components/confirm-delete/confirm-delete.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-manage-notes',
  standalone: true,
  templateUrl: './manage-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, ProductFormComponent, ConfirmDeleteComponent, PaginationComponent]
})
export class ManageNotesComponent {
  private productService = inject(ProductService);
  private titleService = inject(Title);
  notes: Signal<Product[]> = this.productService.getNotes();

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Computed values for pagination
  totalItems = computed(() => this.notes().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedNotes = computed(() => {
    const allNotes = this.notes();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return allNotes.slice(startIndex, endIndex);
  });

  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);

  isDeleteModalOpen = signal(false);
  productToDelete = signal<Product | null>(null);

  isPermanentDeleteModalOpen = signal(false);
  productToPermanentlyDelete = signal<Product | null>(null);

  constructor() {
    this.titleService.setTitle('MirTechHub - Admin: Manage Notes');
  }

  openAddModal() {
    this.editingProduct.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(product: Product) {
    this.editingProduct.set(product);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSave(product: Product) {
    if (this.editingProduct()) {
      this.productService.updateProduct(product);
    } else {
      this.productService.addProduct(product);
    }
    this.closeModal();
  }

  onDelete(product: Product) {
    this.productToDelete.set(product);
    this.isDeleteModalOpen.set(true);
  }

  handleConfirmDelete() {
    const product = this.productToDelete();
    if (product) {
      this.productService.deleteProduct(product);
    }
    this.handleCancelDelete();
  }

  handleCancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.productToDelete.set(null);
  }

  onDeletePermanently(product: Product) {
    this.productToPermanentlyDelete.set(product);
    this.isPermanentDeleteModalOpen.set(true);
  }

  handleConfirmPermanentDelete() {
    const product = this.productToPermanentlyDelete();
    if (product) {
      this.productService.deleteProductPermanently(product);
    }
    this.handleCancelPermanentDelete();
  }

  handleCancelPermanentDelete() {
    this.isPermanentDeleteModalOpen.set(false);
    this.productToPermanentlyDelete.set(null);
  }

  restore(product: Product) {
    this.productService.restoreProduct(product);
  }

  toggleFeatured(product: Product) {
    this.productService.toggleFeaturedStatus(product);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
