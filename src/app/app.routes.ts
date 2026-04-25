import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';

export const routes: Routes = [
  // ── Public area — minimal branded layout ──────────────────────────────────
  // Must come FIRST so that '/' is resolved here before the auth guard fires.
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        // pathMatch: 'full' ensures '/dashboard' is NOT matched as a prefix.
        // Only the exact root URL '/' loads the home feature.
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },

  // ── Authenticated area — header + sidebar ─────────────────────────────────
  // Only reached for paths that don't match the public shell children above.
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'jobs',
        loadChildren: () =>
          import('./features/jobs/jobs.routes').then((m) => m.JOBS_ROUTES),
      },
      {
        path: 'flashcards',
        loadChildren: () =>
          import('./features/flashcards/flashcards.routes').then((m) => m.FLASHCARDS_ROUTES),
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
  },
];
