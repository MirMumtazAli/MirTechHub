import { Order } from '../order.model';

// DTO for fetching a user's order history
export type OrderDto = Order;

// DTO for creating a new order from a list of product IDs
export interface OrderCreateDto {
  items: { productId: number; quantity: number; }[];
}
