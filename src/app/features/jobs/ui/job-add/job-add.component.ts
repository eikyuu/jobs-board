import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  form,
  schema,
  FormField,
  required,
  minLength,
  submit,
} from '@angular/forms/signals';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { JobsState } from '../../data-access/jobs.state';
import { toLocalDateString } from '../../../../shared/utils/date.utils';
import { REMOTE_OPTIONS, CONTRACT_OPTIONS, STATUS_OPTIONS } from '../../constants/job-status.const';
import { Job, JobFormModel, ValidJobFormModel } from '../../models/job.model';

function isValidJobForm(value: JobFormModel): value is ValidJobFormModel {
  return value.remote !== null && value.contractType !== null && value.status !== null;
}

function mapFormToJob(value: ValidJobFormModel): Omit<Job, 'id'> {
  return {
    title: value.title,
    company: value.company,
    location: value.location,
    remote: value.remote,
    contractType: value.contractType,
    status: value.status,
    appliedAt: value.appliedAt ? toLocalDateString(value.appliedAt) : null,
    updatedAt: toLocalDateString(new Date()),
    url: value.url.trim() || undefined,
    salary:
      value.salaryMin != null && value.salaryMax != null
        ? { min: value.salaryMin, max: value.salaryMax, currency: value.salaryCurrency }
        : undefined,
    notes: value.notes.trim() || undefined,
    tags: [],
    contacts: [],
    interviews: [],
  };
}

const JOB_SCHEMA = schema<JobFormModel>((f) => {
  required(f.title, { message: 'Le poste est requis' });
  minLength(f.title, 2, { message: 'Au moins 2 caractères' });
  required(f.company, { message: "L'entreprise est requise" });
  required(f.location, { message: 'Le lieu est requis' });
  required(f.remote, { message: 'Le type de remote est requis' });
  required(f.contractType, { message: 'Le type de contrat est requis' });
  required(f.status, { message: 'Le statut est requis' });
});

@Component({
  selector: 'app-job-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    SelectModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './job-add.component.html',
})
export class JobAddComponent {
  private readonly router = inject(Router);
  private readonly jobsState = inject(JobsState);

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly remoteOptions = REMOTE_OPTIONS;
  protected readonly contractOptions = CONTRACT_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;

  private readonly model = signal<JobFormModel>({
    title: '',
    company: '',
    location: '',
    remote: null,
    contractType: null,
    status: 'applied',
    appliedAt: null,
    url: '',
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: 'EUR',
    notes: '',
  });

  protected readonly jobForm = form(this.model, JOB_SCHEMA);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.serverError.set(null);

    await submit(this.jobForm, async () => {
      this.submitting.set(true);
      try {
        const value = this.model();
        if (!isValidJobForm(value)) return;
        await this.jobsState.addJob(mapFormToJob(value));
        this.router.navigate(['/jobs']);
      } catch {
        this.serverError.set('Une erreur est survenue, veuillez réessayer.');
      } finally {
        this.submitting.set(false);
      }
    });
  }

  protected cancel(): void {
    this.router.navigate(['/jobs']);
  }
}
