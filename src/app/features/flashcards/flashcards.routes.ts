import { Routes } from '@angular/router';

export const FLASHCARDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/flashcards-page/flashcards-page.component').then(
        (m) => m.FlashcardsPageComponent
      ),
  },
];
