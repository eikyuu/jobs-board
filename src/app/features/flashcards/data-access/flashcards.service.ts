import { inject, Injectable } from '@angular/core';
import type { Flashcard, ReviewResult } from '../models/flashcard.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  private readonly httpClient = inject(HttpClient);

  getAll(): Observable<Flashcard[]> {
    return this.httpClient.get<Flashcard[]>(`${environment.apiUrl}/flashcards`);
  }

  reviewCard(id: number, correct: boolean): Observable<Flashcard> {
    const body: ReviewResult = { correct };
    return this.httpClient.post<Flashcard>(`${environment.apiUrl}/flashcards/${id}/review`, body);
  }
}
