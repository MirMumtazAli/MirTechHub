import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart'; // Update with your API URL

  constructor(private http: HttpClient) { }

  // ===== GET ALL ITEMS =====
  getAll(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${id}`);
  }

  // ===== ADD ITEM =====
  add(item: CartItem): Observable<number> {
    // API expects CartItemCreateDto
    return this.http.post<number>(`${this.apiUrl}/add`, item);
  }

  // ===== UPDATE ITEM =====
  update(id: number, item: CartItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  // ===== REMOVE ITEM =====
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
