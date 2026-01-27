
import { Product } from '../product.model';

// DTO for fetching product lists or details
export type ProductDto = Product;

// DTO for creating or updating a product
export interface ProductCreateUpdateDto {
  name?: string;
  description?: string;
  details: string;
  price?: number;
  imageUrl?: string | null;
  pdfUrl?: string | null;
  isFeatured: boolean;
}
