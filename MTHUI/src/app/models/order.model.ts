import { Product } from "./product.model";

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: number;
  name: string | null;
  price: number | null;
  type: string;
  quantity: number;
  imageGallery: [];
}

export interface Order {
  id: string;
  date: Date;
  total: number;
  items: OrderItem[];
  user: { id: string; name: string; };
  status: OrderStatus;
}
