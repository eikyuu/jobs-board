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
import type { ContractType, JobStatus, RemoteType } from '../../../../core/models/job.model';

interface JobFormModel {
  title: string;
  company: string;
  location: string;
  remote: RemoteType | null;
  contractType: ContractType | null;
  status: JobStatus | null;
  appliedAt: Date | null;
  url: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  notes: string;
}

const REMOTE_OPTIONS: { label: string; value: RemoteType }[] = [
  { label: 'Présentiel', value: 'onsite' },
  { label: 'Hybride', value: 'hybrid' },
  { label: 'Full remote', value: 'full' },
];

const CONTRACT_OPTIONS: { label: string; value: ContractType }[] = [
  { label: 'CDI', value: 'CDI' },
  { label: 'CDD', value: 'CDD' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Stage', value: 'Stage' },
  { label: 'Alternance', value: 'Alternance' },
];

const STATUS_OPTIONS: { label: string; value: JobStatus }[] = [
  { label: 'Sauvegardé', value: 'saved' },
  { label: 'Candidaté', value: 'applied' },
  { label: 'Entretien', value: 'interview' },
  { label: 'Offre', value: 'offer' },
  { label: 'Refus', value: 'rejected' },
];

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

  protected async onSubmit($event: Event): Promise<void> {
    $event.preventDefault();
    this.serverError.set(null);

    console.log('Submitting form with value:', this.model());

    try {
      const value = this.model();
      this.jobsState.addJob({
        id: crypto.randomUUID(),
        title: value.title,
        company: value.company,
        location: value.location,
        remote: value.remote!,
        contractType: value.contractType!,
        status: value.status!,
        appliedAt: value.appliedAt ? value.appliedAt.toISOString().split('T')[0] : null,
        updatedAt: new Date().toISOString().split('T')[0],
        url: value.url || undefined,
        salary: value.salaryMin != null && value.salaryMax != null
          ? { min: value.salaryMin, max: value.salaryMax, currency: value.salaryCurrency }
          : undefined,
        notes: value.notes || undefined,
        tags: [],
        contacts: [],
        interviews: [],
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
