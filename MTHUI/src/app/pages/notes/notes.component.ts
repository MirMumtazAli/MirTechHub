
import { Component, ChangeDetectionStrategy, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ProductCardComponent]
})
export class NotesComponent {
  private productService = inject(ProductService);
  notes: Signal<Product[]> = computed(() => 
    this.productService.getNotes()().filter(p => !p.isDeleted)
  );
}
