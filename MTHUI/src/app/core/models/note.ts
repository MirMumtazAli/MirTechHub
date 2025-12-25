export interface Note {
  id?: number;            // optional for create
  title: string;
  content: string;
  description: string;
  author: string;
  createdAt?: string;      // server sets this
  price: number;
  isDeleted?: boolean;     // optional, for soft delete
}
