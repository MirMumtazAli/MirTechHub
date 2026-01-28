import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { PageVisibilityService } from '../../services/page-visibility.service';

// Re-using the password match validator logic
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './account.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  pageVisibilityService = inject(PageVisibilityService);

  isLoading = signal(false);
  showOldPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

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
        let errorMessage = 'Failed to change password. Please check your current password.';

        if (err.error) {
          if (Array.isArray(err.error)) {
            // Handles ASP.NET Core Identity errors which are arrays of objects
            errorMessage = err.error.map((e: { description: string }) => e.description).join(' ');
          } else if (typeof err.error === 'string') {
            // Handles simple string errors
            errorMessage = err.error;
          } else if (err.error.message && typeof err.error.message === 'string') {
            // Handles errors like { message: '...' }
            errorMessage = err.error.message;
          } else if (err.error.title && typeof err.error.title === 'string') {
            // Handle ProblemDetails-like errors
            errorMessage = err.error.title;
          }
        }

        this.notificationService.show(errorMessage, 'error');
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
