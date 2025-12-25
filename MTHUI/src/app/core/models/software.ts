export interface Software {
  id: number;
  name: string;
  description: string;
  version: string;
  author: string | null;
  createdAt: string;
  price: number | null;
  downloadLink: string;
}
