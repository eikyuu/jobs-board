import { computed, Injectable, inject, signal } from '@angular/core';
import { InterviewsService } from './interviews.service';
import { Interview } from '../models/interview.model';

@Injectable({ providedIn: 'root' })
export class InterviewsState {
  private readonly service = inject(InterviewsService);

  private readonly _interviews = signal<Interview[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly interviews = this._interviews.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Entretiens regroupés par date locale (clé = "YYYY-MM-DD") */
  readonly interviewsByDate = computed(() => {
    const map = new Map<string, Interview[]>();
    for (const interview of this._interviews()) {
      const key = interview.scheduledAt.slice(0, 10);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, interview]);
    }
    return map;
  });

  /** Entretiens triés par date croissante */
  readonly sortedInterviews = computed(() =>
    [...this._interviews()].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )
  );

  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.service.getInterviews().subscribe({
      next: (interviews) => {
        this._interviews.set(interviews);
        this._loading.set(false);
      },
      error: (err: unknown) => {
        this._error.set(err instanceof Error ? err.message : 'Erreur de chargement');
        this._loading.set(false);
      },
    });
  }
}
