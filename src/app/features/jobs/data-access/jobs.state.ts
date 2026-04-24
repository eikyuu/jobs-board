import { Injectable, inject, signal, computed } from '@angular/core';
import { JobsService } from './jobs.service';
import { Job } from '../models/job.model';

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

  addJob(job: Job): Promise<void> {
    return new Promise((resolve, reject) => {
      this.service.createJob(job).subscribe({
        next: (createdJob) => {
          this._jobs.update((jobs) => [...jobs, createdJob]);
          resolve();
        },
        error: (err: unknown) => {
          console.error('Error creating job:', err);
          reject(err);
        },
      });
    });
  }

  updateJob(job: Job): Promise<void> {
    return new Promise((resolve, reject) => {
      this.service.updateJob(job).subscribe({
        next: (updatedJob) => {
          this._jobs.update((jobs) =>
            jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
          );
          resolve();
        },
        error: (err: unknown) => {
          console.error('Error updating job:', err);
          reject(err);
        },
      });
    });
  }

  removeJob(id: string): void {
    this.service.deleteJob(id).subscribe({
      next: () => {
        this._jobs.update((jobs) => jobs.filter((j) => j.id !== id));
      },
      error: (err: unknown) => {
        console.error('Error deleting job:', err);
      },
    });
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
