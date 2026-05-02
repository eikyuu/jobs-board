import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard — vincentduguet board',
  },
];
