import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../models/review.model';
import { ReviewCreateDto, ReviewUpdateDto } from '../models/dto/review.dto';
import { tap, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = `${environment.api.apiUrl}/reviews`;

  private reviews = signal<Review[]>([]);

  readonly allReviews = this.reviews.asReadonly();

  constructor() {
    effect(() => {
      // Only admins can fetch all reviews
      if (this.authService.isAdmin()) {
        this.loadAllReviews();
      } else {
        // For regular users, reviews are loaded on product/blog pages, so we don't load all here.
        // But if an admin logs out, we should clear the reviews.
        this.reviews.set([]);
      }
    });
  }

  private loadAllReviews() {
    this.http.get<Review[]>(this.baseUrl).subscribe(data => this.reviews.set(data));
  }

  getReviewsForItem(type: 'product' | 'blog', relatedId: string | number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/item/${type}/${relatedId}`);
  }

  addReview(reviewDto: ReviewCreateDto): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, reviewDto).pipe(
      tap(newReview => {
        // Update the admin's flat list if they are logged in.
        if (this.authService.isAdmin()) {
          this.reviews.update(reviews => [...reviews, newReview]);
        }
      })
    );
  }

  toggleVisibility(reviewId: number) {
    const review = this.reviews().find(r => r.id === reviewId);
    if (!review) return;

    this.http.put(`${this.baseUrl}/${reviewId}/visibility`, { isVisible: !review.isVisible }).pipe(
      tap(() => {
        this.reviews.update(reviews =>
          reviews.map(r => r.id === reviewId ? { ...r, isVisible: !r.isVisible } : r)
        );
      })
    ).subscribe();
  }

  updateReview(reviewId: number, content: ReviewUpdateDto) {
    this.http.put(`${this.baseUrl}/${reviewId}`, content).pipe(
      tap(() => {
        this.reviews.update(reviews =>
          reviews.map(r => {
            if (r.id === reviewId) {
              return {
                ...r,
                comment: content.comment,
                rating: content.rating !== undefined ? content.rating : r.rating,
              };
            }
            return r;
          })
        );
      })
    ).subscribe();
  }

  deleteReview(reviewId: number) {
    this.http.delete(`${this.baseUrl}/${reviewId}`).pipe(
      tap(() => {
        this.reviews.update(reviews => reviews.filter(r => r.id !== reviewId));
      })
    ).subscribe();
  }
}
