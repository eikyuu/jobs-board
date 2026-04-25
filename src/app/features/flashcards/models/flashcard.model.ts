export type FlashcardDifficulty = 'easy' | 'medium' | 'hard';

export interface Flashcard {
  id: number;
  category: string;
  question: string;
  answer: string;
  difficulty: FlashcardDifficulty;
}
