import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Blog } from '../../../core/models/blog';
import { BlogService } from '../../../core/services/blog.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-blog-list',
  templateUrl: './blog-list.component.html',
  standalone: true,
  imports: [RouterModule,CommonModule], // needed for routerLink in template
})
export class AdminBlogListComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getAll().subscribe(data => this.blogs = data);
  }

  editBlog(id: number) {
    this.router.navigate(['/edit-blog', id]);
  }

  deleteBlog(id: number) {
    this.blogService.delete(id).subscribe(() => this.loadBlogs());
  }
}
