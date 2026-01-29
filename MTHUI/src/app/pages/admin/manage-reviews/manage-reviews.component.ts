import { Component, ChangeDetectionStrategy, inject, Signal, signal, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDeleteComponent } from '../../../components/confirm-delete/confirm-delete.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-manage-reviews',
  standalone: true,
  templateUrl: './manage-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ReactiveFormsModule, ConfirmDeleteComponent, PaginationComponent]
})
export class ManageReviewsComponent {
  private reviewService = inject(ReviewService);
  private fb: FormBuilder = inject(FormBuilder);
  private titleService = inject(Title);
  reviews: Signal<Review[]> = this.reviewService.allReviews;

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Computed values for pagination
  totalItems = computed(() => this.reviews().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedReviews = computed(() => {
    const allReviews = this.reviews();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return allReviews.slice(startIndex, endIndex);
  });

  isEditModalOpen = signal(false);
  editingReview = signal<Review | null>(null);

  isDeleteModalOpen = signal(false);
  reviewToDelete = signal<Review | null>(null);

  editForm = this.fb.group({
    rating: [0],
    comment: ['', Validators.required]
  });

  constructor() {
    this.titleService.setTitle('MirTechHub - Admin: Manage Reviews');
  }

  openEditModal(review: Review) {
    this.editingReview.set(review);
    this.editForm.patchValue({
      rating: review.rating ?? 0,
      comment: review.comment
    });
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.editingReview.set(null);
  }

  onSaveEdit() {
    if (this.editForm.invalid || !this.editingReview()) return;

    const currentReview = this.editingReview()!;
    const formValue = this.editForm.value;

    this.reviewService.updateReview(currentReview.id, {
      comment: formValue.comment!,
      rating: currentReview.type === 'product' ? formValue.rating! : undefined
    });

    this.closeEditModal();
  }

  toggleVisibility(reviewId: number) {
    this.reviewService.toggleVisibility(reviewId);
  }

  onDelete(review: Review) {
    this.reviewToDelete.set(review);
    this.isDeleteModalOpen.set(true);
  }

  handleConfirmDelete() {
    const review = this.reviewToDelete();
    if (review) {
      this.reviewService.deleteReview(review.id);
    }
    this.handleCancelDelete();
  }

  handleCancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.reviewToDelete.set(null);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
