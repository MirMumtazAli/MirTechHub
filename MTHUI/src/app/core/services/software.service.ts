import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Software } from '../models/software';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {
  private apiUrl = 'http://localhost:5000/api/softwares'; // Update with your API URL

  constructor(private http: HttpClient) { }

  // ===== Admin & User =====
  getAll(): Observable<Software[]> {
    return this.http.get<Software[]>(this.apiUrl);
  }

  getById(id: number): Observable<Software> {
    return this.http.get<Software>(`${this.apiUrl}/${id}`);
  }

  // ===== Admin Only =====
  create(software: Software): Observable<number> {
    return this.http.post<number>(this.apiUrl, software);
  }

  update(id: number, software: Software): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, software);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
