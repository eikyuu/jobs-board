import { inject, Injectable } from '@angular/core';
import type { Flashcard } from '../models/flashcard.model';
import flashcardsData from '../../../core/mocks/flashcards.json';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  private httpClient = inject(HttpClient);

  getAll(): Observable<Flashcard[]> {
    return this.httpClient.get<Flashcard[]>(`${environment.apiUrl}/flashcards`);
  }
}
