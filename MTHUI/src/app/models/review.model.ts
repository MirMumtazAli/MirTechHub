export interface Review {
  id: number;
  relatedId: string | number; // Product ID or Blog Post ID
  type: 'product' | 'blog';
  authorName: string;
  authorId: string;
  rating?: number; // 1-5, optional for blogs
  comment: string;
  date: Date;
  isVisible: boolean;
  parentId?: number;
  replies?: Review[];
}
