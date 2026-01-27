
import { Component, ChangeDetectionStrategy, inject, signal, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../services/blog.service';
import { BlogPost } from '../../../models/blog-post.model';
import { BlogFormComponent } from '../../../components/blog-form/blog-form.component';
import { ConfirmDeleteComponent } from '../../../components/confirm-delete/confirm-delete.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-manage-blogs',
  templateUrl: './manage-blogs.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BlogFormComponent, ConfirmDeleteComponent, PaginationComponent]
})
export class ManageBlogsComponent {
  private blogService = inject(BlogService);
  posts: Signal<BlogPost[]> = this.blogService.getPosts();

  // Pagination state
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Computed values for pagination
  totalItems = computed(() => this.posts().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  paginatedPosts = computed(() => {
    const allPosts = this.posts();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return allPosts.slice(startIndex, endIndex);
  });

  isModalOpen = signal(false);
  editingPost = signal<BlogPost | null>(null);

  isDeleteModalOpen = signal(false);
  postToDelete = signal<BlogPost | null>(null);

  isPermanentDeleteModalOpen = signal(false);
  postToPermanentlyDelete = signal<BlogPost | null>(null);

  openAddModal() {
    this.editingPost.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(post: BlogPost) {
    this.editingPost.set(post);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSave(postData: Partial<BlogPost>) {
    if (this.editingPost()) {
      // It's an existing post being edited
      this.blogService.updatePost({ ...this.editingPost()!, ...postData });
    } else {
      // It's a new post
      this.blogService.addPost(postData);
    }
    this.closeModal();
  }

  onDelete(post: BlogPost) {
    this.postToDelete.set(post);
    this.isDeleteModalOpen.set(true);
  }

  handleConfirmDelete() {
    const post = this.postToDelete();
    if (post) {
      this.blogService.deletePost(post);
    }
    this.handleCancelDelete();
  }

  handleCancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.postToDelete.set(null);
  }
  
  onDeletePermanently(post: BlogPost) {
    this.postToPermanentlyDelete.set(post);
    this.isPermanentDeleteModalOpen.set(true);
  }

  handleConfirmPermanentDelete() {
    const post = this.postToPermanentlyDelete();
    if (post) {
      this.blogService.deletePostPermanently(post);
    }
    this.handleCancelPermanentDelete();
  }

  handleCancelPermanentDelete() {
    this.isPermanentDeleteModalOpen.set(false);
    this.postToPermanentlyDelete.set(null);
  }

  restore(post: BlogPost) {
    this.blogService.restorePost(post);
  }

  toggleFeatured(post: BlogPost) {
    this.blogService.toggleFeaturedStatus(post);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
