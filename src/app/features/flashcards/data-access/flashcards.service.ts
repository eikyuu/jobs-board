import { Injectable } from '@angular/core';
import type { Flashcard } from '../models/flashcard.model';
import flashcardsData from '../../../core/mocks/flashcards.json';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  private readonly cards: Flashcard[] = flashcardsData as Flashcard[];

  getAll(): Flashcard[] {
    return this.cards;
  }
}
