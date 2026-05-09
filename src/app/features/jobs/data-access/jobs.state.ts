import { Injectable, inject, signal, computed } from '@angular/core';
import { JobsService } from './jobs.service';
import { Job } from '../models/job.model';
import { firstValueFrom } from 'rxjs';

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

  async addJob(job: Job): Promise<void> {
    try {
      const createdJob = await firstValueFrom(this.service.createJob(job));
      this._jobs.update((jobs) => [...jobs, createdJob]);
    } catch (err) {
      console.error('Error creating job:', err);
      throw err;
    }
  }

  async updateJob(job: Job): Promise<void> {
    try {
      const updatedJob = await firstValueFrom(this.service.updateJob(job));
      this._jobs.update((jobs) =>
        jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
      );
    } catch (err) {
      console.error('Error updating job:', err);
      throw err;
    }
  }

  async removeJob(id: string): Promise<void> {
    try {
      await firstValueFrom(this.service.deleteJob(id));
      this._jobs.update((jobs) => jobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Error removing job:', err);
      throw err;
    }
  }

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const jobs = await firstValueFrom(this.service.getJobs());
      this._jobs.set(jobs);
    } catch (err: unknown) {
      this._error.set(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      this._loading.set(false);
    }
  }
}
