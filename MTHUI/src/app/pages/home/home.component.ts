import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { BlogService } from '../../services/blog.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { PageVisibilityService } from '../../services/page-visibility.service';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, RouterLink, SafeHtmlPipe]
})
export class HomeComponent {
  private productService = inject(ProductService);
  private blogService = inject(BlogService);
  private titleService = inject(Title);
  pageVisibilityService = inject(PageVisibilityService);

  constructor() {
    this.titleService.setTitle('MirTechHub - Home');
  }

  featuredNotes = computed(() => {
    return this.productService.getNotes()().filter(p => p.isFeatured && !p.isDeleted);
  });

  featuredSoftware = computed(() => {
    return this.productService.getSoftware()().filter(p => p.isFeatured && !p.isDeleted);
  });

  featuredPosts = computed(() => this.blogService.getPosts()().filter(p => p.isFeatured && !p.isDeleted));
}
