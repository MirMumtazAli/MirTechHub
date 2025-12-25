import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterModule], // needed for routerLink in template
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    // Temporary logic
    localStorage.setItem('role', 'Admin');
    alert('Admin logged in');
  }
}
