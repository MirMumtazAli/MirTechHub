
import { Component, ChangeDetectionStrategy, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ProductCardComponent]
})
export class SoftwareComponent {
  private productService = inject(ProductService);
  software: Signal<Product[]> = computed(() => 
    this.productService.getSoftware()().filter(p => !p.isDeleted)
  );
}
