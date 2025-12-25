export interface CartItem {
  id: number;
  productId: number;
  productType: 'Note' | 'Software';
  title: string;
  price: number;
  quantity: number;
}
