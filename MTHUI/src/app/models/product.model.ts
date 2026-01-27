
export interface Product {
  id: number;
  name: string;
  description?: string;
  details: string;
  price: number;
  type: 'note' | 'software';
  imageUrl: string;
  imageGallery: string[];
  pdfUrl?: string;
  isFeatured?: boolean;
  isDeleted?: boolean;
}
