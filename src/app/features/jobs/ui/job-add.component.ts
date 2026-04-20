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
import { JobsState } from '../data-access/jobs.state';
import type { ContractType, JobStatus, RemoteType } from '../../../core/models/job.model';

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
  template: `
    <div class="max-w-3xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-2xl font-semibold m-0 mb-1">Nouvelle candidature</h1>
        <p class="text-sm text-gray-500 m-0">Renseignez les informations de l'offre</p>
      </header>

      <form (submit)="onSubmit($event)" novalidate class="flex flex-col gap-6" aria-label="Formulaire d'ajout de candidature">

        @if (serverError()) {
          <div class="bg-red-50 text-red-600 rounded-lg p-4" role="alert">{{ serverError() }}</div>
        }

        <!-- Poste & Entreprise -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="title" class="text-sm font-medium">
              Intitulé du poste <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              pInputText
              [formField]="jobForm.title"
              placeholder="Ex : Développeur Angular Senior"
              [attr.aria-describedby]="jobForm.title().errors().length ? 'title-error' : null"
              [attr.aria-invalid]="jobForm.title().invalid() ? true : null"
            />
            @if (jobForm.title().touched() && jobForm.title().errors().length > 0) {
              <small id="title-error" class="text-red-500" role="alert">
                {{ jobForm.title().errors()[0].message }}
              </small>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="company" class="text-sm font-medium">
              Entreprise <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              pInputText
              [formField]="jobForm.company"
              placeholder="Ex : Capgemini"
              [attr.aria-describedby]="jobForm.company().errors().length ? 'company-error' : null"
              [attr.aria-invalid]="jobForm.company().invalid() ? true : null"
            />
            @if (jobForm.company().touched() && jobForm.company().errors().length > 0) {
              <small id="company-error" class="text-red-500" role="alert">
                {{ jobForm.company().errors()[0].message }}
              </small>
            }
          </div>
        </div>

        <!-- Lieu & Remote -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="location" class="text-sm font-medium">
              Lieu <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              pInputText
              [formField]="jobForm.location"
              placeholder="Ex : Paris, France"
              [attr.aria-describedby]="jobForm.location().errors().length ? 'location-error' : null"
              [attr.aria-invalid]="jobForm.location().invalid() ? true : null"
            />
            @if (jobForm.location().touched() && jobForm.location().errors().length > 0) {
              <small id="location-error" class="text-red-500" role="alert">
                {{ jobForm.location().errors()[0].message }}
              </small>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="remote" class="text-sm font-medium">
              Télétravail <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <p-select
              inputId="remote"
              [formField]="$any(jobForm.remote)"
              [options]="remoteOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner"
              [attr.aria-describedby]="jobForm.remote().errors().length ? 'remote-error' : null"
            />
            @if (jobForm.remote().touched() && jobForm.remote().errors().length > 0) {
              <small id="remote-error" class="text-red-500" role="alert">
                {{ jobForm.remote().errors()[0].message }}
              </small>
            }
          </div>
        </div>

        <!-- Contrat & Statut -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="contractType" class="text-sm font-medium">
              Type de contrat <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <p-select
              inputId="contractType"
              [formField]="$any(jobForm.contractType)"
              [options]="contractOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner"
              [attr.aria-describedby]="jobForm.contractType().errors().length ? 'contract-error' : null"
            />
            @if (jobForm.contractType().touched() && jobForm.contractType().errors().length > 0) {
              <small id="contract-error" class="text-red-500" role="alert">
                {{ jobForm.contractType().errors()[0].message }}
              </small>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="status" class="text-sm font-medium">
              Statut <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <p-select
              inputId="status"
              [formField]="$any(jobForm.status)"
              [options]="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner"
              [attr.aria-describedby]="jobForm.status().errors().length ? 'status-error' : null"
            />
            @if (jobForm.status().touched() && jobForm.status().errors().length > 0) {
              <small id="status-error" class="text-red-500" role="alert">
                {{ jobForm.status().errors()[0].message }}
              </small>
            }
          </div>
        </div>

        <!-- Date de candidature & URL -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label for="appliedAt" class="text-sm font-medium">Date de candidature</label>
            <p-datepicker
              inputId="appliedAt"
              [formField]="$any(jobForm.appliedAt)"
              dateFormat="dd/mm/yy"
              [showIcon]="true"
              placeholder="jj/mm/aaaa"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="url" class="text-sm font-medium">Lien vers l'offre</label>
            <input
              id="url"
              type="url"
              pInputText
              [formField]="jobForm.url"
              placeholder="https://..."
            />
          </div>
        </div>

        <!-- Salaire -->
        <fieldset class="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
          <legend class="text-sm font-medium px-1">Salaire (optionnel)</legend>
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label for="salaryMin" class="text-sm font-medium">Min (€)</label>
              <p-inputnumber
                inputId="salaryMin"
                [formField]="$any(jobForm.salaryMin)"
                [min]="0"
                placeholder="40000"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="salaryMax" class="text-sm font-medium">Max (€)</label>
              <p-inputnumber
                inputId="salaryMax"
                [formField]="$any(jobForm.salaryMax)"
                [min]="0"
                placeholder="55000"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="salaryCurrency" class="text-sm font-medium">Devise</label>
              <input
                id="salaryCurrency"
                type="text"
                pInputText
                [formField]="jobForm.salaryCurrency"
                placeholder="EUR"
              />
            </div>
          </div>
        </fieldset>

        <!-- Notes -->
        <div class="flex flex-col gap-1">
          <label for="notes" class="text-sm font-medium">Notes</label>
          <textarea
            id="notes"
            [formField]="jobForm.notes"
            rows="4"
            placeholder="Informations complémentaires, impressions, points à préparer…"
            class="w-full"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-2">
          <p-button
            type="button"
            label="Annuler"
            severity="secondary"
            (onClick)="cancel()"
          />
          <p-button
            type="submit"
            label="Ajouter la candidature"
            [loading]="submitting()"
          />
        </div>

      </form>
    </div>
  `,
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
