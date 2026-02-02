import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LoginDto, RegisterDto, ChangePasswordDto } from '../models/dto/auth.dto';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  expiration: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly baseUrl = `${environment.api.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'authToken';

  // 🔐 Auth state
  readonly currentUser = signal<User | null>(this.getUserFromToken());

  // 🛡️ Role check (NULL SAFE)
  readonly isAdmin = computed(() => {
    const user = this.currentUser();
    return !!user && user.role?.toLowerCase() === 'admin';
  });

  // ===============================
  // JWT HANDLING
  // ===============================

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = this.decodeJwt(token);

      // 🔑 ASP.NET Core standard claim URIs
      const id =
        payload['sub'] ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      const name =
        payload['unique_name'] ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      const email =
        payload['email'] ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

      const role =
        payload['role'] ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (!id) {
        return null;
      }

      const userRole = Array.isArray(role) ? role[0] : role;
      if (!userRole) {
        return null;
      }

      return {
        id: id.toString(),
        name: name || '',
        email: email || '',
        role: userRole
      };

    } catch (err) {
      this.clearToken();
      return null;
    }
  }

  private decodeJwt(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  // ===============================
  // TOKEN STORAGE
  // ===============================

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.currentUser.set(this.getUserFromToken());
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
  }

  // ===============================
  // API CALLS
  // ===============================

  login(email: string, password: string): Observable<AuthResponse> {
    const dto: LoginDto = { email, password };

    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, dto)
      .pipe(
        tap(res => {
          if (res?.token) {
            this.setToken(res.token);
          }
        })
      );
  }

  register(name: string, email: string, password: string): Observable<any> {
    const dto: RegisterDto = { name, email, password };
    return this.http.post(`${this.baseUrl}/register`, dto);
  }

  changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, dto);
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
