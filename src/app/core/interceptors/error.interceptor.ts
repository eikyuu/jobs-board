import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Functional HTTP interceptor for centralised error handling.
 *
 * - 400 Bad Request  → logs error details to the console
 * - 401 Unauthorized → forces logout and redirects to login
 * - 403 Forbidden    → navigates to /forbidden
 * - 500+ Server error → navigates to /error
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          console.error('[ErrorInterceptor] Bad Request', error.error);
          break;

        case 401:
          // Token expired or invalid — clear session
          authService.logout();
          break;

        case 403:
          router.navigate(['/forbidden']);
          break;

        case 500:
        case 502:
        case 503:
          router.navigate(['/error']);
          break;

        default:
          if (error.status >= 500) {
            router.navigate(['/error']);
          } else {
            console.error('[ErrorInterceptor] HTTP error', error.status, error.message);
          }
      }

      return throwError(() => error);
    })
  );
};
