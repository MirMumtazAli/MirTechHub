import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  templateUrl: './product-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardSkeletonComponent { }
