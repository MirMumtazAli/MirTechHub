import { Component, ChangeDetectionStrategy, inject, computed, Signal, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/review.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageVisibilityService } from '../../services/page-visibility.service';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  imports: [AsyncPipe, CurrencyPipe, RouterLink, ReactiveFormsModule, DatePipe, ConfirmDeleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private fb: FormBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  cartService = inject(CartService);
  pageVisibilityService = inject(PageVisibilityService);

  private readonly productId = signal<number | null>(null);

  readonly reviews: Signal<Review[]> = computed(() => {
    const id = this.productId();
    if (id === null) return [];
    // Use loose equality (==) to compare string from review with number from route
    return this.reviewService.allReviews().filter(r => r.relatedId == id && r.type === 'product' && r.isVisible);
  });

  readonly product = signal<Product | undefined>(undefined);

  constructor() {

    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        const routePath = this.route.snapshot.routeConfig?.path;
        const type = routePath?.startsWith('note') ? 'note' :
          routePath?.startsWith('software') ? 'software' : undefined;

        if (id && type) {
          const numericId = Number(id);
          this.productId.set(numericId);
          return this.productService.getProductById(numericId, type);
        }

        this.productId.set(null);
        return of(undefined);
      })
    ).subscribe(product => {
      this.product.set(product);
    });
  }

  readonly reviewForm = this.fb.group({
    rating: [5, Validators.required],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly reviewSubmitted = signal(false);

  // User review editing state
  editingReviewId = signal<number | null>(null);
  editReviewForm = this.fb.group({
    rating: [5, Validators.required],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  // User review deletion state
  isDeleteModalOpen = signal(false);
  reviewToDelete = signal<Review | null>(null);

  submitReview() {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) return;

    const currentUser = this.authService.currentUser();
    const id = this.productId();
    if (!currentUser || id === null) return;

    this.reviewService.addReview({
      relatedId: id.toString(), // Convert number to string for the DTO
      type: 'product',
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!
    });

    this.reviewForm.reset({ rating: 5, comment: '' });
    this.reviewSubmitted.set(true);
  }

  startEdit(review: Review): void {
    this.editingReviewId.set(review.id);
    this.editReviewForm.setValue({
      rating: review.rating || 5,
      comment: review.comment
    });
  }

  cancelEdit(): void {
    this.editingReviewId.set(null);
  }

  saveEdit(reviewId: number): void {
    if (this.editReviewForm.invalid) return;
    this.reviewService.updateReview(reviewId, {
      comment: this.editReviewForm.value.comment!,
      rating: this.editReviewForm.value.rating!
    });
    this.editingReviewId.set(null);
  }

  onDeleteReview(review: Review): void {
    this.reviewToDelete.set(review);
    this.isDeleteModalOpen.set(true);
  }

  handleConfirmDelete(): void {
    const review = this.reviewToDelete();
    if (review) {
      this.reviewService.deleteReview(review.id);
    }
    this.handleCancelDelete();
  }

  handleCancelDelete(): void {
    this.isDeleteModalOpen.set(false);
    this.reviewToDelete.set(null);
  }
}
