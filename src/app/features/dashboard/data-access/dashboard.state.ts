import { Injectable, inject, signal, computed } from '@angular/core';
import { DashboardService, StatCard, ActivityRow } from './dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Signals-based state container for the Dashboard feature.
 *
 * Provides reactive state slices and loading/error tracking
 * without an external state management library.
 */
@Injectable({ providedIn: 'root' })
export class DashboardState {
  private readonly service = inject(DashboardService);

  // ── Raw state ────────────────────────────────────────────────────────────
  private readonly _stats = signal<StatCard[]>([]);
  private readonly _activity = signal<ActivityRow[]>([]);
  private readonly _loadingState = signal<LoadingState>('idle');
  private readonly _error = signal<string | null>(null);

  // ── Public read-only signals ──────────────────────────────────────────────
  readonly stats = this._stats.asReadonly();
  readonly activity = this._activity.asReadonly();
  readonly loadingState = this._loadingState.asReadonly();
  readonly error = this._error.asReadonly();

  // ── Derived signals ───────────────────────────────────────────────────────
  readonly isLoading = computed(() => this._loadingState() === 'loading');
  readonly hasError = computed(() => this._loadingState() === 'error');
  readonly isEmpty = computed(
    () => this._loadingState() === 'success' && this._stats().length === 0
  );

  /**
   * Loads all dashboard data and updates state signals.
   * Safe to call multiple times; cancels in-flight requests via `takeUntilDestroyed`.
   */
  load(): void {
    this._loadingState.set('loading');
    this._error.set(null);

    this.service
      .getDashboardData()
      // .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this._stats.set(data.stats);
          this._activity.set(data.recentActivity);
          this._loadingState.set('success');
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
          this._error.set(message);
          this._loadingState.set('error');
        },
      });
  }

  /** Resets state to initial idle values */
  reset(): void {
    this._stats.set([]);
    this._activity.set([]);
    this._loadingState.set('idle');
    this._error.set(null);
  }
}
