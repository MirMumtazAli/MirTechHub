import { Component, ChangeDetectionStrategy, inject, computed, signal, Signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { BlogPost } from '../../../models/blog-post.model';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { Review } from '../../../models/review.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageVisibilityService } from '../../../services/page-visibility.service';
import { ConfirmDeleteComponent } from '../../../components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  templateUrl: './blog-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, DatePipe, ConfirmDeleteComponent, AsyncPipe]
})
export class BlogPostComponent {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private reviewService = inject(ReviewService);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  pageVisibilityService = inject(PageVisibilityService);

  private readonly postId = signal<string | null>(null);

  readonly comments: Signal<Review[]> = computed(() => {
    const id = this.postId();
    if (id === null) return [];
    return this.reviewService.allReviews().filter(r => r.relatedId === id && r.type === 'blog' && r.isVisible);
  });

  readonly post$: Observable<BlogPost | undefined> = this.route.paramMap.pipe(
    switchMap((params: ParamMap) => {
      const id = params.get('id');
      this.postId.set(id);
      return id ? this.blogService.getPostById(id) : of(undefined);
    })
  );

  readonly commentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  readonly commentSubmitted = signal(false);

  // User comment editing state
  editingReviewId = signal<number | null>(null);
  editCommentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  // User comment deletion state
  isDeleteModalOpen = signal(false);
  reviewToDelete = signal<Review | null>(null);

  submitComment() {
    this.commentForm.markAllAsTouched();
    if (this.commentForm.invalid) return;

    const currentUser = this.authService.currentUser();
    const id = this.postId();
    if (!currentUser || id === null) return;

    this.reviewService.addReview({
      relatedId: id,
      type: 'blog',
      comment: this.commentForm.value.comment!
    });

    this.commentForm.reset({ comment: '' });
    this.commentSubmitted.set(true);
  }

  startEdit(comment: Review): void {
    this.editingReviewId.set(comment.id);
    this.editCommentForm.setValue({
      comment: comment.comment
    });
  }

  cancelEdit(): void {
    this.editingReviewId.set(null);
  }

  saveEdit(commentId: number): void {
    if (this.editCommentForm.invalid) return;
    this.reviewService.updateReview(commentId, {
      comment: this.editCommentForm.value.comment!,
    });
    this.editingReviewId.set(null);
  }

  onDeleteReview(comment: Review): void {
    this.reviewToDelete.set(comment);
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
