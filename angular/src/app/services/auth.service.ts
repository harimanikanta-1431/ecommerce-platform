import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, AuthSession, AuthUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'admin_access_token';
  private userKey = 'admin_user';
  currentUser = signal<AuthUser | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthSession> {
    return this.http
      .post<ApiResponse<AuthSession>>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => response.data),
        tap(session => {
          localStorage.setItem(this.tokenKey, session.accessToken);
          localStorage.setItem(this.userKey, JSON.stringify(session.user));
          this.currentUser.set(session.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return this.currentUser()?.role === 'ADMIN';
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };

      if (!payload.exp) {
        return true;
      }

      return payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
