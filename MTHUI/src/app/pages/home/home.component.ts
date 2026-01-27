
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { BlogService } from '../../services/blog.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { PageVisibilityService } from '../../services/page-visibility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ProductCardComponent, RouterLink]
})
export class HomeComponent {
  private productService = inject(ProductService);
  private blogService = inject(BlogService);
  pageVisibilityService = inject(PageVisibilityService);

  featuredNotes = computed(() => {
    return this.productService.getNotes()().filter(p => p.isFeatured && !p.isDeleted);
  });

  featuredSoftware = computed(() => {
    return this.productService.getSoftware()().filter(p => p.isFeatured && !p.isDeleted);
  });

  featuredPosts = computed(() => this.blogService.getPosts()().filter(p => p.isFeatured && !p.isDeleted));
}
