import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Blog } from '../../../core/models/blog';
import { BlogService } from '../../../core/services/blog.service';


@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
})
export class EditBlogComponent implements OnInit {
  blog: Blog | null = null;

  constructor(private route: ActivatedRoute, private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blogService.getById(id).subscribe(data => this.blog = data);
  }

  updateBlog() {
    if (!this.blog) return;
    this.blogService.update(this.blog.id, this.blog).subscribe(() => {
      alert('Blog updated successfully!');
      this.router.navigate(['/admin-blog-list']);
    });
  }
}
