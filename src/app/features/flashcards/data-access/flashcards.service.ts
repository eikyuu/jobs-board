import { inject, Injectable } from '@angular/core';
import type { Flashcard, ReviewResult } from '../models/flashcard.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  private httpClient = inject(HttpClient);

  getAll(): Observable<Flashcard[]> {
    return this.httpClient.get<Flashcard[]>(`${environment.apiUrl}/flashcards`);
  }

  reviewCard(id: number, correct: boolean): Observable<Flashcard> {
    const body: ReviewResult = { correct };
    return this.httpClient.post<Flashcard>(`${environment.apiUrl}/flashcards/${id}/review`, body);
  }
}
