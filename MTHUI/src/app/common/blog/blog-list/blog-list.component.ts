import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Blog } from '../../../core/models/blog';
import { BlogService } from '../../../core/services/blog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.blogService.getAll().subscribe(data => this.blogs = data);
  }

  viewDetail(id: number) {
    this.router.navigate(['/blogs', id]);
  }

}
