import { Component, Input } from '@angular/core';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-review',
  templateUrl: './post-review.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class PostReviewComponent {
  @Input() productId!: number; // Note or Software ID
  @Input() productType!: 'Note' | 'Software';
  rating: number = 5;
  comment: string = '';

  constructor(private reviewService: ReviewService) { }

  submitReview() {
    const review: Review = {
      id: 0, // backend will assign
      userId: 1, // replace with logged-in user
      productId: this.productId,
      productType: this.productType,
      rating: this.rating,
      comment: this.comment,
      createdAt: new Date().toISOString()
    };

    this.reviewService.create(review).subscribe(() => {
      alert('Review submitted successfully!');
      this.rating = 5;
      this.comment = '';
    });
  }
}
