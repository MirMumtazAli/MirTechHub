export interface Note {
  id: number;
  title: string;
  description?: string;
  content?: string;
  price: number;
  isFree: boolean;
  fileUrl?: string;
  pages: number;
  createdAt: Date;
  reviews?: Review[];
  isDeleted: boolean; // <-- add this
}

export interface NoteForm {
  title: string;
  description?: string;
  content?: string;
  price: number;
  isFree: boolean;
  fileUrl?: string;
  pages: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: Date;
}
