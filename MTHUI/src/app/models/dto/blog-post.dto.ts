
import { BlogPost } from '../blog-post.model';

// DTO for fetching blog post lists or details
export type BlogPostDto = BlogPost;

// DTO for creating or updating a blog post
export interface BlogPostCreateUpdateDto {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string | null;
  isFeatured: boolean;
}
