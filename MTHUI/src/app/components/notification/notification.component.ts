
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  private notification = this.notificationService.notification;

  notificationAsArray = computed(() => {
    const notif = this.notification();
    return notif ? [notif] : [];
  });
}
