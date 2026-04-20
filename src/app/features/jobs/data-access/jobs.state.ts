import { Injectable, inject, signal, computed } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { JobsService } from './jobs.service';

@Injectable({ providedIn: 'root' })
export class JobsState {
  private readonly service = inject(JobsService);

  private readonly _jobs = signal<Job[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly jobs = this._jobs.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasError = computed(() => this._error() !== null);

  readonly applied = computed(() =>
    this._jobs().filter((j) => j.appliedAt !== null)
  );

  addJob(job: Job): void {
    this._jobs.update((jobs) => [...jobs, job]);
  }

  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.service.getJobs().subscribe({
      next: (jobs) => {
        this._jobs.set(jobs);
        this._loading.set(false);
      },
      error: (err: unknown) => {
        this._error.set(err instanceof Error ? err.message : 'Erreur de chargement');
        this._loading.set(false);
      },
    });
  }
}
