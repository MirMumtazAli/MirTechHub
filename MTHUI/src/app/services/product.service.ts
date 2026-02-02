import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, tap, of, finalize } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.api.apiUrl}/products`;

  private notes = signal<Product[]>([]);
  private software = signal<Product[]>([]);
  private notesLoading = signal(true);
  private softwareLoading = signal(true);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.notesLoading.set(true);
    this.http.get<Product[]>(`${this.baseUrl}?type=note`).pipe(
      finalize(() => this.notesLoading.set(false))
    ).subscribe({
      next: data => this.notes.set(data),
      error: err => {
        console.error('Failed to load notes:', err);
        this.notesLoading.set(false);
      }
    });

    this.softwareLoading.set(true);
    this.http.get<Product[]>(`${this.baseUrl}?type=software`).pipe(
      finalize(() => this.softwareLoading.set(false))
    ).subscribe({
      next: data => this.software.set(data),
      error: err => {
        console.error('Failed to load software:', err);
        this.softwareLoading.set(false);
      }
    });
  }

  getNotes() {
    return this.notes.asReadonly();
  }

  getNotesLoading() {
    return this.notesLoading.asReadonly();
  }

  getSoftware() {
    return this.software.asReadonly();
  }

  getSoftwareLoading() {
    return this.softwareLoading.asReadonly();
  }

  getProductById(id: number, type: 'note' | 'software'): Observable<Product | undefined> {
    const signalToCheck = type === 'note' ? this.notes : this.software;
    const existingProduct = signalToCheck().find(p => p.id === id);

    if (existingProduct) {
      return of(existingProduct);
    }

    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Product): void {
    const { type, ...dto } = product;
    this.http.post<Product>(`${this.baseUrl}?type=${type}`, dto).pipe(
      tap(newProduct => {
        const signalToUpdate = type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products => [...products, newProduct]);
      })
    ).subscribe({
      error: err => console.error('Add product failed:', err)
    });
  }

  updateProduct(updatedProduct: Product): void {
    const { type, id, ...dto } = updatedProduct;
    this.http.put<Product>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(savedProduct => {
        const signalToUpdate = type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(p => p.id === savedProduct.id ? savedProduct : p)
        );
      })
    ).subscribe({
      error: err => console.error('Update product failed:', err)
    });
  }

  deleteProduct(productToDelete: Product): void {
    this.http.patch<Product>(`${this.baseUrl}/${productToDelete.id}/delete`, {}).pipe(
      tap((updatedProduct) => {
        const signalToUpdate = updatedProduct.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
      })
    ).subscribe({
      error: err => console.error('Delete product failed:', err)
    });
  }

  deleteProductPermanently(productToDelete: Product): void {
    this.http.delete(`${this.baseUrl}/${productToDelete.id}`).pipe(
      tap(() => {
        const signalToUpdate = productToDelete.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.filter(p => p.id !== productToDelete.id)
        );
      })
    ).subscribe({
      error: err => console.error('Delete product permanently failed:', err)
    });
  }

  restoreProduct(productToRestore: Product): void {
    this.http.patch<Product>(`${this.baseUrl}/${productToRestore.id}/restore`, {}).pipe(
      tap((updatedProduct) => {
        const signalToUpdate = updatedProduct.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
      })
    ).subscribe({
      error: err => console.error('Restore product failed:', err)
    });
  }

  toggleFeaturedStatus(productToToggle: Product): void {
    this.http.patch<Product>(`${this.baseUrl}/${productToToggle.id}/toggle-featured`, {}).pipe(
      tap((updatedProduct) => {
        const signalToUpdate = productToToggle.type === 'note' ? this.notes : this.software;
        signalToUpdate.update(products =>
          products.map(product =>
            product.id === productToToggle.id ? updatedProduct : product
          )
        );
      })
    ).subscribe({
      error: err => console.error('Toggle featured status failed:', err)
    });
  }
}
