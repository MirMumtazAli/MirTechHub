import { Component, ChangeDetectionStrategy, inject, Signal, signal, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog-post.model';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { BlogPostSkeletonComponent } from '../../components/blog-post-skeleton/blog-post-skeleton.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, PaginationComponent, SafeHtmlPipe, BlogPostSkeletonComponent]
})
export class BlogComponent {
  private blogService = inject(BlogService);
  private titleService = inject(Title);
  private allPosts: Signal<BlogPost[]> = computed(() =>
    this.blogService.getPosts()().filter(p => !p.isDeleted)
  );

  isLoading = this.blogService.getPostsLoading();
  searchTerm = signal('');

  constructor() {
    this.titleService.setTitle('MirTechHub - Blog');
  }

  filteredPosts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allPosts();
    }
    return this.allPosts().filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term)
    );
  });

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(5);

  // Computed values for pagination
  totalItems = computed(() => this.filteredPosts().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedPosts = computed(() => {
    const posts = this.filteredPosts();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return posts.slice(startIndex, endIndex);
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset to first page on new search
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
