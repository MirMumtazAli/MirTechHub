import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  // FIX: Add explicit type to 'http' to prevent it from being inferred as 'unknown'.
  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.api.apiUrl}/blogposts`;
  private posts = signal<BlogPost[]>([]);
  private postsLoading = signal(true);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.postsLoading.set(true);
    this.http.get<BlogPost[]>(this.baseUrl).pipe(
      finalize(() => this.postsLoading.set(false))
    ).subscribe({
      next: data => this.posts.set(data),
      error: err => console.error('Failed to load blog posts:', err)
    });
  }

  getPosts() {
    return this.posts.asReadonly();
  }

  getPostsLoading() {
    return this.postsLoading.asReadonly();
  }

  getPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.baseUrl}/${id}`);
  }

  addPost(postData: Partial<BlogPost>) {
    this.http.post<BlogPost>(this.baseUrl, postData).pipe(
      tap(newPost => {
        this.posts.update(posts => [newPost, ...posts]);
      })
    ).subscribe();
  }

  updatePost(updatedPost: BlogPost) {
    this.http.put<BlogPost>(`${this.baseUrl}/${updatedPost.id}`, updatedPost).pipe(
      tap(savedPost => {
        this.posts.update(posts =>
          posts.map(post => post.id === savedPost.id ? savedPost : post)
        );
      })
    ).subscribe();
  }

  deletePost(postToDelete: BlogPost) {
    this.http.patch(`${this.baseUrl}/${postToDelete.id}/delete`, {}).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.map(post => post.id === postToDelete.id ? { ...post, isDeleted: true } : post)
        );
      })
    ).subscribe();
  }

  deletePostPermanently(postToDelete: BlogPost) {
    this.http.delete(`${this.baseUrl}/${postToDelete.id}`).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.filter(post => post.id !== postToDelete.id)
        );
      })
    ).subscribe();
  }

  restorePost(postToRestore: BlogPost) {
    this.http.patch(`${this.baseUrl}/${postToRestore.id}/restore`, {}).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.map(post => post.id === postToRestore.id ? { ...post, isDeleted: false } : post)
        );
      })
    ).subscribe();
  }

  toggleFeaturedStatus(postToToggle: BlogPost) {
    this.http.patch(`${this.baseUrl}/${postToToggle.id}/toggle-featured`, {}).pipe(
      tap(() => {
        this.posts.update(posts =>
          posts.map(post =>
            post.id === postToToggle.id
              ? { ...post, isFeatured: !post.isFeatured }
              : post
          )
        );
      })
    ).subscribe();
  }
}
