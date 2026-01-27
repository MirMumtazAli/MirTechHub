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
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router: Router = inject(Router);
  private readonly baseUrl = `${environment.api.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'authToken';

  readonly currentUser = signal<User | null>(this.getUserFromToken());
  readonly isAdmin = computed(() => this.currentUser()?.role.toLowerCase() === 'admin');

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid JWT format: token does not have 3 parts.');
        return null;
      }

      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      // ⭐ Handle both claim formats
      const id = payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const name = payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      const email = payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (!id || !email || !role) {
        console.error('Invalid JWT payload: missing required claims.');
        return null;
      }

      return { id, name: name || '', email, role };
    } catch (error) {
      console.error('Failed to decode token:', error);
      this.clearToken();
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.currentUser.set(this.getUserFromToken());
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const loginDto: LoginDto = { email, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginDto).pipe(
      tap(response => {
        
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    const registerDto: RegisterDto = { name, email, password };
    // ⭐ FIX: Use proper template literal syntax
    return this.http.post(`${this.baseUrl}/register`, registerDto);
  }

  changePassword(dto: ChangePasswordDto): Observable<any> {
    // ⭐ FIX: Use proper template literal syntax
    return this.http.post(`${this.baseUrl}/change-password`, dto);
  }

  logout() {
    this.clearToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
