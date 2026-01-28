import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  register() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name!, email!, password!).subscribe(() => {
        this.registrationSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // Redirect after 3 seconds
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
