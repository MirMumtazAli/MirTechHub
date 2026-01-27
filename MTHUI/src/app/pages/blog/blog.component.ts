
import { Component, ChangeDetectionStrategy, inject, Signal, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class BlogComponent {
  private blogService = inject(BlogService);
  private allPosts: Signal<BlogPost[]> = computed(() => 
    this.blogService.getPosts()().filter(p => !p.isDeleted)
  );
  
  searchTerm = signal('');

  posts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allPosts();
    }
    return this.allPosts().filter(post => 
      post.title.toLowerCase().includes(term) || 
      post.content.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
