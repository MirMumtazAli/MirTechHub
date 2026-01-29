import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageVisibilityService } from '../../../services/page-visibility.service';

@Component({
  selector: 'app-manage-visibility',
  standalone: true,
  templateUrl: './manage-visibility.component.html',
  styleUrls: ['./manage-visibility.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ManageVisibilityComponent {
  pageVisibilityService = inject(PageVisibilityService);
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('MirTechHub - Admin: Settings');
  }
}
