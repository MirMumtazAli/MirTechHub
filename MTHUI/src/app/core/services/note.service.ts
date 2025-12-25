import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, NoteForm } from '../models/note';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private baseUrl = 'http://localhost:5000/api/notes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.baseUrl);
  }

  getById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/${id}`);
  }

  create(noteForm: NoteForm): Observable<Note> {
    return this.http.post<Note>(this.baseUrl, noteForm);
  }

  update(id: number, noteForm: NoteForm): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, noteForm);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  restore(id: number) {
    return this.http.put<void>(`${this.baseUrl}/${id}/restore`, {});
  }
}
