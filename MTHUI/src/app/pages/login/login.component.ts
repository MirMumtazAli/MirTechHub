import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);
  private titleService = inject(Title);
  // FIX: Add explicit type to 'router' to prevent it from being inferred as 'unknown'.
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);

  isLoading = signal(false);
  showPassword = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {
    this.titleService.setTitle('MirTechHub - Login');
  }

  login() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.handlePostLogin();
      },
      error: (err) => {
        this.notificationService.show('Invalid email or password.', 'error');
        this.isLoading.set(false);
      }
    });
  }

  private handlePostLogin() {
    const pendingItem = this.cartService.pendingItem();
    if (pendingItem) {
      this.cartService.addItemToCart(pendingItem);
      this.cartService.clearPendingItem();
      this.router.navigate(['/cart']);
    } else if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/notes']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
