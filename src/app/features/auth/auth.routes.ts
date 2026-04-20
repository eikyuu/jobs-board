import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./ui/login.component').then((m) => m.LoginComponent),
    title: 'Sign In — templateproject',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
