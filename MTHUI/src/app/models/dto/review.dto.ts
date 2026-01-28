import { Review } from '../review.model';

// DTO for fetching reviews
export type ReviewDto = Review;

// DTO for creating a new review or comment
export interface ReviewCreateDto {
  relatedId: string | number;
  type: 'product' | 'blog';
  rating?: number;
  comment: string;
  parentId?: number;
}

// DTO for updating an existing review or comment
export interface ReviewUpdateDto {
  rating?: number;
  comment: string;
}
