import { Injectable, signal } from '@angular/core';
import type { AuthUser } from '../../domain/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'hr_payroll_token';
  private readonly USER_KEY = 'hr_payroll_user';
  
  currentUser = signal<AuthUser | null>(this.loadUser());

  saveAuth(token: string, user: { id: string; username: string; role: string }): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set({ ...user, token });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUser(): AuthUser | null {
    const token = this.getToken();
    const userJson = localStorage.getItem(this.USER_KEY);
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        return { ...user, token };
      } catch {
        return null;
      }
    }
    return null;
  }
}
