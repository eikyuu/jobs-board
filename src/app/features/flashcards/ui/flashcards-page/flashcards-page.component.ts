import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
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

@Component({
  selector: 'app-flashcards-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TagModule, ButtonModule, SelectModule, SafeHtmlPipe],
  templateUrl: './flashcards-page.component.html',
})
export class FlashcardsPageComponent {
  private readonly service = inject(FlashcardsService);

  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly currentIndex = signal(0);
  protected readonly isFlipped = signal(false);

  private readonly allCards: Flashcard[] = this.service.getAll();

  protected readonly filteredCards = computed(() => {
    const category = this.selectedCategory();
    return category ? this.allCards.filter((c) => c.category === category) : this.allCards;
  });

  protected readonly currentCard = computed(() => this.filteredCards()[this.currentIndex()]);

  protected readonly categoryOptions = computed<CategoryOption[]>(() => {
    const categories = [...new Set(this.allCards.map((c) => c.category))];
    return [
      { label: 'Toutes les catégories', value: null },
      ...categories.map((c) => ({ label: c, value: c })),
    ];
  });

  protected flip(): void {
    this.isFlipped.update((v) => !v);
  }

  protected next(): void {
    const len = this.filteredCards().length;
    //rendre aleatoire le prochain index\
    const randomIndex = Math.floor(Math.random() * len);
    this.currentIndex.update((i) => randomIndex);
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

  protected difficultyLabel(difficulty: FlashcardDifficulty): string {
    const labels: Record<FlashcardDifficulty, string> = {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
    };
    return labels[difficulty];
  }

  protected difficultyToSeverity(difficulty: FlashcardDifficulty): 'success' | 'warn' | 'danger' {
    const map: Record<FlashcardDifficulty, 'success' | 'warn' | 'danger'> = {
      easy: 'success',
      medium: 'warn',
      hard: 'danger',
    };
    return map[difficulty];
  }
}
