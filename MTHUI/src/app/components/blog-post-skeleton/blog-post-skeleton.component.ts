import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-blog-post-skeleton',
  standalone: true,
  templateUrl: './blog-post-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostSkeletonComponent { }
