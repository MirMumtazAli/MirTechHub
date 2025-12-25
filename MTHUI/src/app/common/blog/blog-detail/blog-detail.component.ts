import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Blog } from '../../../core/models/blog';
import { BlogService } from '../../../core/services/blog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.blogService.getBySlug(slug).subscribe(data => this.blog = data);
  }
}
