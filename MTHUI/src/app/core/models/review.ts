export interface Review {
  id: number;
  userId: number;
  productId: number;
  productType: 'Note' | 'Software';
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}
