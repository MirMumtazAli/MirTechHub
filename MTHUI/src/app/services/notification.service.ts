
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly notification = signal<Notification | null>(null);
  private timer: any;
  private nextId = 0;

  show(message: string, type: 'success' | 'error' = 'success') {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.notification.set({ id: ++this.nextId, message, type });
    this.timer = setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    this.notification.set(null);
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
    }
  }
}
