import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:5000/api/blogs'; // Update with your API URL

  constructor(private http: HttpClient) { }

  // ===== GET ALL BLOGS =====
  getAll(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBySlug(slug: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${slug}`);
  }

  getById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  // ===== ADMIN =====
  create(blog: Blog): Observable<number> {
    return this.http.post<number>(this.apiUrl, blog);
  }

  update(id: number, blog: Blog): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, blog);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
