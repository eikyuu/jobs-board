import { Routes } from '@angular/router';

export const INTERVIEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/interviews-page/interviews-page.component').then(
        (m) => m.InterviewsPageComponent
      ),
    title: 'Entretiens',
  },
];
