import { computed, Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const interviews = await firstValueFrom(this.service.getInterviews());
      this._interviews.set(interviews);
    } catch (err: unknown) {
      this._error.set(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      this._loading.set(false);
    }
  }
}
