export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // optional if not storing plain password
  role: 'User' | 'Admin';
  createdAt: string;
}
