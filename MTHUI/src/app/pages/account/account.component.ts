import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

// Re-using the password match validator logic
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = signal(false);

  changePasswordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatchValidator });

  submitForm() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.changePasswordForm.value;

    this.authService.changePassword({
      oldPassword: formValue.oldPassword!,
      newPassword: formValue.newPassword!,
      confirmPassword: formValue.confirmPassword!
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notificationService.show('Password changed successfully. Please log in again.');
        // For enhanced security, log the user out after a password change.
        this.authService.logout();
      },
      error: (err) => {
        this.isLoading.set(false);
        // Handle specific errors from the backend
        if (err.error && Array.isArray(err.error)) {
          const errorMessage = err.error.map((e: any) => e.description).join(' ');
          this.notificationService.show(errorMessage || 'An unknown error occurred.', 'error');
        } else {
          this.notificationService.show('Failed to change password. Please check your current password.', 'error');
        }
      }
    });
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }
}
