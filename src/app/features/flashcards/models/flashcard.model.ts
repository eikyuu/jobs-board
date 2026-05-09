export type FlashcardDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Flashcard {
  id: number;
  category: string;
  question: string;
  answer: string;
  difficulty: FlashcardDifficulty;
  leitnerBox: number;
  nextReviewAt: string; // ISO date string
  totalReviews: number;
  correctReviews: number;
  createdAt: string; // ISO date string
}

export interface ReviewResult {
  correct: boolean;
}