import { Component, OnInit } from '@angular/core';
import { Review } from '../../core/models/review';
import { ReviewService } from '../../core/services/review.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-reviews',
  templateUrl: './admin-reviews.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule], // needed for routerLink in template
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  selectedReview: Review | null = null;

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAll().subscribe(data => this.reviews = data);
  }

  selectReview(review: Review) {
    this.selectedReview = { ...review }; // copy for editing
  }

  updateReview(review: Review) {
    if (!review.id) return;
    this.reviewService.update(review.id, review).subscribe(() => this.loadReviews());
  }

  deleteReview(id: number) {
    this.reviewService.delete(id).subscribe(() => this.loadReviews());
  }
}

