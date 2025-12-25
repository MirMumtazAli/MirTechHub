import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Blog } from '../../../core/models/blog';
import { BlogService } from '../../../core/services/blog.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  standalone: true,
  imports: [RouterModule, FormsModule], // needed for routerLink in template
})
export class AddBlogComponent {
  blog: Blog = {
      id: 0,
      title: '',
      description: '',
      content: '',
      author: 'Admin', // Static for admin
      createdAt: new Date().toISOString(),
      slug: ''
  };

  constructor(private blogService: BlogService, private router: Router) { }

  submitBlog() {
    this.blogService.create(this.blog).subscribe(() => {
      alert('Blog created successfully!');
      this.router.navigate(['/admin-blog-list']);
    });
  }
}
