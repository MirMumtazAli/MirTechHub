import { CartItem } from "./cart-item";

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  orderDate: string;
}
