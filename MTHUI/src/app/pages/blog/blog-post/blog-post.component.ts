import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, ParamMap } from '@angular/router';
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

declare var Quill: any;

@Component({
  selector: 'app-blog-post',
  standalone: true,
  templateUrl: './blog-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, DatePipe, ConfirmDeleteComponent, AsyncPipe]
})
export class BlogPostComponent implements AfterViewInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private reviewService = inject(ReviewService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  authService = inject(AuthService);
  pageVisibilityService = inject(PageVisibilityService);

  private readonly postId = signal<string | null>(null);
  readonly comments = signal<Review[]>([]);
  @ViewChild('commentEditor') commentEditorEl!: ElementRef;
  private commentQuill: any;
  private isCommentEditorInitialized = false;

  readonly post$: Observable<BlogPost | undefined> = this.route.paramMap.pipe(
    switchMap((params: ParamMap) => {
      const id = params.get('id');
      this.postId.set(id);
      if (id) {
        this.reviewService.getReviewsForItem('blog', id).subscribe(comments => this.comments.set(comments));
        return this.blogService.getPostById(id);
      }
      return of(undefined);
    })
  );

  readonly commentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  readonly commentSubmitted = signal(false);
  editingReviewId = signal<number | null>(null);
  editCommentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  isDeleteModalOpen = signal(false);
  reviewToDelete = signal<Review | null>(null);

  replyingToId = signal<number | null>(null);
  replyForm = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngAfterViewInit(): void {
    if (this.commentEditorEl) {
      this.initializeCommentEditor();
    }
  }

  private initializeCommentEditor() {
    const toolbarOptions = [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['clean']];
    this.commentQuill = new Quill(this.commentEditorEl.nativeElement, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Join the discussion...'
    });
    this.isCommentEditorInitialized = true;
    this.commentQuill.on('text-change', () => {
      const content = this.commentQuill.root.innerHTML;
      const finalContent = content === '<p><br></p>' ? '' : content;
      this.commentForm.get('comment')?.setValue(finalContent, { emitEvent: false });
    });
  }

  submitComment() {
    this.commentForm.markAllAsTouched();
    if (this.commentForm.invalid || !this.isCommentEditorInitialized) return;

    const currentUser = this.authService.currentUser();
    const id = this.postId();
    if (!currentUser || id === null) return;

    this.reviewService.addReview({
      relatedId: id,
      type: 'blog',
      comment: this.commentForm.value.comment!
    }).subscribe(newComment => {
      this.comments.update(currentComments => [...currentComments, newComment]);
      this.commentQuill.setText('');
      this.commentForm.reset({ comment: '' });
      this.commentSubmitted.set(true);
    });
  }

  submitReply(parentId: number) {
    this.replyForm.markAllAsTouched();
    if (this.replyForm.invalid) return;

    const currentUser = this.authService.currentUser();
    const id = this.postId();
    if (!currentUser || id === null) return;

    this.reviewService.addReview({
      relatedId: id,
      type: 'blog',
      comment: this.replyForm.value.comment!,
      parentId: parentId
    }).subscribe(newReply => {
      this.addReplyToState(newReply);
      this.replyingToId.set(null);
      this.replyForm.reset();
    });
  }

  private addReplyToState(reply: Review) {
    const comments = this.comments();
    const addReplyRecursive = (commentList: Review[]): Review[] => {
      return commentList.map(comment => {
        if (comment.id === reply.parentId) {
          const updatedReplies = comment.replies ? [...comment.replies, reply] : [reply];
          return { ...comment, replies: updatedReplies };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: addReplyRecursive(comment.replies) };
        }
        return comment;
      });
    };
    this.comments.set(addReplyRecursive(comments));
  }

  toggleReplyForm(commentId: number | null) {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    this.replyingToId.set(this.replyingToId() === commentId ? null : commentId);
  }

  startEdit(comment: Review): void {
    this.editingReviewId.set(comment.id);
    this.editCommentForm.setValue({ comment: comment.comment });
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
