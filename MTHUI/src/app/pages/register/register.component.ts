import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

// Custom validator to check if two fields match
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private titleService = inject(Title);
  private notificationService = inject(NotificationService);
  // FIX: Add explicit type to 'router' to prevent it from being inferred as 'unknown'.
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);

  registrationSuccess = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatchValidator });

  constructor() {
    this.titleService.setTitle('MirTechHub - Register');
  }

  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name!, email!, password!).subscribe({
        next: () => {
          this.registrationSuccess.set(true);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // Redirect after 3 seconds
        },
        error: (err) => {
          // ASP.NET Core's default JSON serialization uses camelCase for properties.
          // We check for `err.error.message` first, and fallback to `Message` for robustness.
          const errorMessage = err.error?.message || err.error?.Message || 'Registration failed. Please try again.';
          if (err.status === 400 && errorMessage.toLowerCase().includes('email is already in use')) {
            this.registerForm.get('email')?.setErrors({ emailInUse: true });
          } else {
            this.notificationService.show(errorMessage, 'error');
          }
        }
      });
    }
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
