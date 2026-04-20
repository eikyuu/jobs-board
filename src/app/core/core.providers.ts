/**
 * Barrel export for the Core layer.
 * Import core providers and tokens from here instead of deep file paths.
 */

export { AuthService } from './auth/auth.service';
export type { User, LoginCredentials, AuthResponse } from './auth/auth.service';

export { authInterceptor } from './interceptors/auth.interceptor';
export { errorInterceptor } from './interceptors/error.interceptor';

export { authGuard } from './guards/auth.guard';
