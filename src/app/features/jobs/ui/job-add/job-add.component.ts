import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { JobsState } from '../../data-access/jobs.state';
import { ValidJobFormModel } from '../../models/job.model';
import { JobFormComponent, mapFormToJob } from '../job-form/job-form.component';

@Component({
  selector: 'app-job-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JobFormComponent],
  template: `
    <div class="max-w-3xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-2xl font-semibold m-0 mb-1">Nouvelle candidature</h1>
        <p class="text-sm text-gray-500 m-0">Renseignez les informations de l'offre</p>
      </header>
      <app-job-form
        submitLabel="Ajouter la candidature"
        [submitting]="submitting()"
        [serverError]="serverError()"
        (formSubmit)="onFormSubmit($event)"
        (cancelled)="cancel()"
      />
    </div>
  `,
})
export class JobAddComponent {
  private readonly router = inject(Router);
  private readonly jobsState = inject(JobsState);
  private readonly messageService = inject(MessageService);

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected async onFormSubmit(value: ValidJobFormModel): Promise<void> {
    this.serverError.set(null);
    this.submitting.set(true);
    try {
      await this.jobsState.addJob(mapFormToJob(value));
      this.messageService.add({
        severity: 'success',
        summary: 'Candidature ajoutée',
        detail: 'La candidature a été ajoutée avec succès.',
      });
      this.router.navigate(['/jobs']);
    } catch {
      this.serverError.set('Une erreur est survenue, veuillez réessayer.');
    } finally {
      this.submitting.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigate(['/jobs']);
  }
}
