import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FlashcardsService } from '../../data-access/flashcards.service';
import type { Flashcard, FlashcardDifficulty } from '../../models/flashcard.model';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

interface CategoryOption {
  label: string;
  value: string | null;
}

type ReviewMode = 'leitner' | 'free';

@Component({
  selector: 'app-flashcards-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TagModule, ButtonModule, SelectModule, SafeHtmlPipe],
  templateUrl: './flashcards-page.component.html',
  styleUrl: './flashcards-page.component.scss',
})
export class FlashcardsPageComponent {
  private readonly service = inject(FlashcardsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly currentIndex = signal(0);
  protected readonly isFlipped = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly mode = signal<ReviewMode>('leitner');

  // Source unique de vérité — writable pour les mises à jour locales après review
  protected readonly allCards = signal<Flashcard[]>([]);

  constructor() {
    this.service
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cards) => this.allCards.set(cards));
  }

  private get todayIso(): string {
    // Retourne la date du jour au format YYYY-MM-DD
    return new Date().toISOString().split('T')[0];
  }

  protected readonly dueCards = computed(() => {
    const today = this.todayIso;
    return this.allCards().filter((c) => c.nextReviewAt.split('T')[0] <= today);
  });

  protected readonly filteredCards = computed(() => {
    const category = this.selectedCategory();
    const cards = this.mode() === 'leitner' ? this.dueCards() : this.allCards();
    return category ? cards.filter((c) => c.category === category) : cards;
  });

  protected readonly currentCard = computed(() => this.filteredCards()[this.currentIndex()]);

  protected readonly categoryOptions = computed<CategoryOption[]>(() => {
    const categories = [...new Set(this.allCards().map((c) => c.category))];
    return [
      { label: 'Toutes les catégories', value: null },
      ...categories.map((c) => ({ label: c, value: c })),
    ];
  });

  protected readonly allReviewed = computed(
    () => this.mode() === 'leitner' && this.filteredCards().length === 0 && this.allCards().length > 0,
  );

  protected flip(): void {
    this.isFlipped.update((v) => !v);
  }

  protected next(): void {
    const len = this.filteredCards().length;
    if (len <= 1) return;
    const randomIndex = Math.floor(Math.random() * len);
    this.currentIndex.set(randomIndex);
    this.isFlipped.set(false);
  }

  protected prev(): void {
    const len = this.filteredCards().length;
    this.currentIndex.update((i) => (i - 1 + len) % len);
    this.isFlipped.set(false);
  }

  protected onCategoryChange(value: string | null): void {
    this.selectedCategory.set(value);
    this.currentIndex.set(0);
    this.isFlipped.set(false);
  }

  protected toggleMode(): void {
    this.mode.update((m) => (m === 'leitner' ? 'free' : 'leitner'));
    this.currentIndex.set(0);
    this.isFlipped.set(false);
  }

  protected submitReview(correct: boolean): void {
    const card = this.currentCard();
    if (!card || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    this.service
      .reviewCard(card.id, correct)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedCard) => {
          // Met à jour la carte localement — évite un rechargement complet
          this.allCards.update((cards) => cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
          this.isSubmitting.set(false);
          this.isFlipped.set(false);
          // Ajuste l'index si on était sur la dernière carte de la liste filtrée
          const remaining = this.filteredCards().length;
          if (remaining > 0 && this.currentIndex() >= remaining) {
            this.currentIndex.set(remaining - 1);
          }
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  protected difficultyLabel(difficulty: FlashcardDifficulty): string {
    const labels: Record<FlashcardDifficulty, string> = {
      EASY: 'Facile',
      MEDIUM: 'Moyen',
      HARD: 'Difficile',
    };
    return labels[difficulty];
  }

  protected difficultyToSeverity(difficulty: FlashcardDifficulty): 'success' | 'warn' | 'danger' {
    const map: Record<FlashcardDifficulty, 'success' | 'warn' | 'danger'> = {
      EASY: 'success',
      MEDIUM: 'warn',
      HARD: 'danger',
    };
    return map[difficulty];
  }
}
