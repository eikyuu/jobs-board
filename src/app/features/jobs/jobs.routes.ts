import { Routes } from '@angular/router';

export const JOBS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/jobs-list/jobs-list.component').then((m) => m.JobsListComponent),
    title: 'Candidatures — Jobs Board',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./ui/job-add/job-add.component').then((m) => m.JobAddComponent),
    title: 'Nouvelle candidature — Jobs Board',
  },
];
