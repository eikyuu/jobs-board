import { Routes } from '@angular/router';

export const JOBS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/jobs-list.component').then((m) => m.JobsListComponent),
    title: 'Candidatures — Jobs Board',
  },
];
