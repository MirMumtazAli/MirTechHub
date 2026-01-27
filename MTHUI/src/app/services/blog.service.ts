import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5121/api/blogposts';
  private posts = signal<BlogPost[]>([]);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // ⭐ FIX: Add error handling
    this.http.get<BlogPost[]>(this.baseUrl).pipe(
      catchError(error => {
        console.warn('Could not load blog posts:', error.message);
        return of([]); // Return empty array on error
      })
    ).subscribe(data => this.posts.set(data));
  }

  getPosts() {
    return this.posts.asReadonly();
  }

  getPostById(id: string): Observable<BlogPost> {
    // ⭐ FIX: Proper template literal
    return this.http.get<BlogPost>(`${this.baseUrl}/${id}`);
  }

  addPost(postData: Partial<BlogPost>) {
    this.http.post<BlogPost>(this.baseUrl, postData).pipe(
      tap(newPost => {
        this.posts.update(posts => [newPost, ...posts]);
      }),
      catchError(error => {
        console.error('Error adding post:', error);
        return of(null);
      })
    ).subscribe();
  }

  updatePost(updatedPost: BlogPost) {
    // ⭐ FIX: Proper template literal
    this.http.put<BlogPost>(`${this.baseUrl}/${updatedPost.id}`, updatedPost).pipe(
      tap(savedPost => {
        this.posts.update(posts =>
          posts.map(post => post.id === savedPost.id ? savedPost : post)
        );
      }),
      catchError(error => {
        console.error('Error updating post:', error);
        return of(null);
      })
    ).subscribe();
  }

  deletePost(postToDelete: BlogPost) {
    // ⭐ FIX: Proper template literal
    this.http.patch(`${this.baseUrl}/${postToDelete.id}/delete`, {}).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.map(post => post.id === postToDelete.id ? { ...post, isDeleted: true } : post)
        );
      }),
      catchError(error => {
        console.error('Error deleting post:', error);
        return of(null);
      })
    ).subscribe();
  }

  deletePostPermanently(postToDelete: BlogPost) {
    // ⭐ FIX: Proper template literal
    this.http.delete(`${this.baseUrl}/${postToDelete.id}`).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.filter(post => post.id !== postToDelete.id)
        );
      }),
      catchError(error => {
        console.error('Error deleting post permanently:', error);
        return of(null);
      })
    ).subscribe();
  }

  restorePost(postToRestore: BlogPost) {
    // ⭐ FIX: Proper template literal
    this.http.patch(`${this.baseUrl}/${postToRestore.id}/restore`, {}).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.map(post => post.id === postToRestore.id ? { ...post, isDeleted: false } : post)
        );
      }),
      catchError(error => {
        console.error('Error restoring post:', error);
        return of(null);
      })
    ).subscribe();
  }

  toggleFeaturedStatus(postToToggle: BlogPost) {
    // ⭐ FIX: Proper template literal
    this.http.patch(`${this.baseUrl}/${postToToggle.id}/toggle-featured`, {}).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.map(post =>
            post.id === postToToggle.id
              ? { ...post, isFeatured: !post.isFeatured }
              : post
          )
        );
      }),
      catchError(error => {
        console.error('Error toggling featured status:', error);
        return of(null);
      })
    ).subscribe();
  }
}
