import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Authenticated user model */
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatarUrl?: string;
}

/** Credentials payload for login */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Token + user returned by the auth endpoint */
export interface AuthResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Singleton service managing authentication state via Angular Signals.
 * Token and user are persisted to localStorage and rehydrated on init.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(this.readToken());
  private readonly _user = signal<User | null>(this.readUser());

  /** Read-only signal exposing the current JWT */
  readonly token = this._token.asReadonly();

  /** Read-only signal exposing the current authenticated user */
  readonly user = this._user.asReadonly();

  /** Derived signal: true when a valid token is present */
  readonly isAuthenticated = computed(() => !!this._token());

  /**
   * Sends login credentials and stores the resulting session.
   * @param credentials - email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    if (!environment.production) {
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123',
          email: credentials.email,
          name: 'John Doe',
          roles: ['user'],
          avatarUrl: 'https://i.pravatar.cc/150?img=3',
        },
      };
      return new Observable<AuthResponse>((observer) => {
        setTimeout(() => {
          this.persistSession(mockResponse);
          observer.next(mockResponse);
          observer.complete();
        }, 1000); // Simulate network delay
      });
    } else {
      return this.http
        .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
        .pipe(
          tap((response) => this.persistSession(response)),
          catchError((error) => throwError(() => error))
        );
    }
  }

  /**
   * Clears the session state, storage, and redirects to login.
   */
  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/auth/login']);
  }

  private persistSession(response: AuthResponse): void {
    this._token.set(response.token);
    this._user.set(response.user);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }

  private readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
