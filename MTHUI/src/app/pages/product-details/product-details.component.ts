import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, ParamMap } from '@angular/router';
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

declare var Quill: any;

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  imports: [AsyncPipe, CurrencyPipe, RouterLink, ReactiveFormsModule, DatePipe, ConfirmDeleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements AfterViewInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  authService = inject(AuthService);
  cartService = inject(CartService);
  pageVisibilityService = inject(PageVisibilityService);

  private readonly productId = signal<number | null>(null);
  private productType: 'note' | 'software' | undefined;

  readonly reviews = signal<Review[]>([]);
  @ViewChild('reviewEditor') reviewEditorEl!: ElementRef;
  private reviewQuill: any;
  private isReviewEditorInitialized = false;

  readonly product$: Observable<Product | undefined> = this.route.paramMap.pipe(
    switchMap((params: ParamMap) => {
      const id = params.get('id');
      const routePath = this.route.snapshot.routeConfig?.path;
      this.productType = routePath?.startsWith('note') ? 'note' : routePath?.startsWith('software') ? 'software' : undefined;

      if (id && this.productType) {
        const numericId = Number(id);
        this.productId.set(numericId);
        // FIX: The review service expects 'product' as the type for both notes and software.
        this.reviewService.getReviewsForItem('product', numericId).subscribe(reviews => this.reviews.set(reviews));
        return this.productService.getProductById(numericId, this.productType);
      }

      this.productId.set(null);
      return of(undefined);
    })
  );

  readonly reviewForm = this.fb.group({
    rating: [5, Validators.required],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly reviewSubmitted = signal(false);

  editingReviewId = signal<number | null>(null);
  editReviewForm = this.fb.group({
    rating: [5, Validators.required],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  isDeleteModalOpen = signal(false);
  reviewToDelete = signal<Review | null>(null);

  replyingToId = signal<number | null>(null);
  replyForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngAfterViewInit(): void {
    if (this.reviewEditorEl) {
      this.initializeReviewEditor();
    }
  }

  private initializeReviewEditor() {
    const toolbarOptions = [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['clean']];
    this.reviewQuill = new Quill(this.reviewEditorEl.nativeElement, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Tell us what you think...'
    });
    this.isReviewEditorInitialized = true;
    this.reviewQuill.on('text-change', () => {
      const content = this.reviewQuill.root.innerHTML;
      const finalContent = content === '<p><br></p>' ? '' : content;
      this.reviewForm.get('comment')?.setValue(finalContent, { emitEvent: false });
    });
  }

  submitReview() {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid || !this.isReviewEditorInitialized) return;

    const currentUser = this.authService.currentUser();
    const id = this.productId();
    if (!currentUser || id === null) return;

    this.reviewService.addReview({
      relatedId: id.toString(),
      type: 'product',
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!
    }).subscribe(newReview => {
      this.reviews.update(currentReviews => [...currentReviews, newReview]);
      this.reviewQuill.setText('');
      this.reviewForm.reset({ rating: 5, comment: '' });
      this.reviewSubmitted.set(true);
    });
  }

  submitReply(parentId: number) {
    this.replyForm.markAllAsTouched();
    if (this.replyForm.invalid) return;

    const currentUser = this.authService.currentUser();
    const id = this.productId();
    if (!currentUser || id === null) return;

    this.reviewService.addReview({
      relatedId: id.toString(),
      type: 'product',
      comment: this.replyForm.value.comment!,
      parentId: parentId
    }).subscribe(newReply => {
      this.addReplyToState(newReply);
      this.replyingToId.set(null);
      this.replyForm.reset();
    });
  }

  private addReplyToState(reply: Review) {
    const reviews = this.reviews();
    const addReplyRecursive = (reviewList: Review[]): Review[] => {
      return reviewList.map(review => {
        if (review.id === reply.parentId) {
          const updatedReplies = review.replies ? [...review.replies, reply] : [reply];
          return { ...review, replies: updatedReplies };
        }
        if (review.replies && review.replies.length > 0) {
          return { ...review, replies: addReplyRecursive(review.replies) };
        }
        return review;
      });
    };
    this.reviews.set(addReplyRecursive(reviews));
  }

  toggleReplyForm(reviewId: number | null) {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    this.replyingToId.set(this.replyingToId() === reviewId ? null : reviewId);
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
