
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageVisibilityService } from '../../../services/page-visibility.service';

@Component({
  selector: 'app-manage-visibility',
  templateUrl: './manage-visibility.component.html',
  styleUrls: ['./manage-visibility.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ManageVisibilityComponent {
  pageVisibilityService = inject(PageVisibilityService);
}
