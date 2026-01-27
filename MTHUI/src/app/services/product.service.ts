import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.apiUrl}/products`;

  private notes = signal<Product[]>([]);
  private software = signal<Product[]>([]);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<Product[]>(`${this.baseUrl}?type=note`).subscribe({
      next: data => this.notes.set(data),
      error: err => console.error('Failed to load notes:', err)
    });
    this.http.get<Product[]>(`${this.baseUrl}?type=software`).subscribe({
      next: data => this.software.set(data),
      error: err => console.error('Failed to load software:', err)
    });
  }

  getNotes() {
    return this.notes.asReadonly();
  }

  getSoftware() {
    return this.software.asReadonly();
  }

  getProductById(id: number, type: 'note' | 'software'): Observable<Product | undefined> {
    // Optimization: Check the local signal first before fetching from the API.
    const signalToCheck = type === 'note' ? this.notes : this.software;
    const existingProduct = signalToCheck().find(p => p.id === id);

    if (existingProduct) {
      // If found in the signal, return it as an observable.
      return of(existingProduct);
    }

    // If not found locally, fetch fresh data from the API.
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Product) {
    const { type, ...dto } = product;
    this.http.post<Product>(`${this.baseUrl}?type=${type}`, dto).pipe(
      tap(newProduct => {
        const signalToUpdate = type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products => [...products, newProduct]);
      })
    ).subscribe();
  }

  updateProduct(updatedProduct: Product) {
    const { type, id, ...dto } = updatedProduct;
    this.http.put<Product>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(savedProduct => {
        const signalToUpdate = type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(p => p.id === savedProduct.id ? savedProduct : p)
        );
      })
    ).subscribe();
  }

  deleteProduct(productToDelete: Product) {
    this.http.patch(`${this.baseUrl}/${productToDelete.id}/delete`, {}).pipe(
      tap(() => {
        const signalToUpdate = productToDelete.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(p => p.id === productToDelete.id ? { ...p, isDeleted: true } : p)
        );
      })
    ).subscribe();
  }

  deleteProductPermanently(productToDelete: Product) {
    this.http.delete(`${this.baseUrl}/${productToDelete.id}`).pipe(
      tap(() => {
        const signalToUpdate = productToDelete.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.filter(p => p.id !== productToDelete.id)
        );
      })
    ).subscribe();
  }

  restoreProduct(productToRestore: Product) {
    this.http.patch(`${this.baseUrl}/${productToRestore.id}/restore`, {}).pipe(
      tap(() => {
        const signalToUpdate = productToRestore.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(p => p.id === productToRestore.id ? { ...p, isDeleted: false } : p)
        );
      })
    ).subscribe();
  }

  toggleFeaturedStatus(productToToggle: Product) {
    this.http.patch<Product>(`${this.baseUrl}/${productToToggle.id}/toggle-featured`, {}).pipe(
      tap(() => {
        const signalToUpdate = productToToggle.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(product =>
            product.id === productToToggle.id
              ? { ...product, isFeatured: !product.isFeatured }
              : product
          )
        );
      })
    ).subscribe();
  }
}
