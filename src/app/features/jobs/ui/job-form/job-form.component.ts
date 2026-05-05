import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  linkedSignal,
  computed,
  signal,
} from '@angular/core';
import {
  form,
  schema,
  FormField,
  required,
  minLength,
  submit,
} from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { REMOTE_OPTIONS, CONTRACT_OPTIONS, STATUS_OPTIONS, INTERVIEW_TYPE_OPTIONS } from '../../constants/job-status.const';
import { Job, JobFormModel, ValidJobFormModel, InterviewFormEntry, InterviewType } from '../../models/job.model';
import { toLocalDateString, toLocalDateTimeString } from '../../../../shared/utils/date.utils';

export const DEFAULT_JOB_FORM: JobFormModel = {
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
  interviews: [],
};

export function jobToFormModel(job: Job): JobFormModel {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    remote: job.remote,
    contractType: job.contractType,
    status: job.status,
    appliedAt: job.appliedAt ? new Date(job.appliedAt) : null,
    url: job.url ?? '',
    salaryMin: job.salary?.min ?? null,
    salaryMax: job.salary?.max ?? null,
    salaryCurrency: job.salary?.currency ?? 'EUR',
    notes: job.notes ?? '',
    interviews: job.interviews.map((i) => ({
      scheduledAt: new Date(i.scheduledAt),
      type: i.type ?? null,
    })),
  };
}

export function mapFormToJob(value: ValidJobFormModel): Omit<Job, 'id'> {
  return {
    applicationType: 'standard',
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
    interviews: (value.interviews ?? [])
      .filter((e): e is { scheduledAt: Date; type: InterviewType } => e.scheduledAt !== null && e.type !== null)
      .map((e) => ({
        scheduledAt: toLocalDateTimeString(e.scheduledAt),
        type: e.type,
      })),
  };
}

function isValidJobForm(value: JobFormModel): value is ValidJobFormModel {
  return value.remote !== null && value.contractType !== null && value.status !== null;
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
  selector: 'app-job-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    FormField,
    SelectModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
  ],
  templateUrl: './job-form.component.html',
})
export class JobFormComponent {
  readonly initialValue = input<JobFormModel>(DEFAULT_JOB_FORM);
  readonly submitLabel = input.required<string>();
  readonly submitting = input(false);
  readonly serverError = input<string | null>(null);

  readonly formSubmit = output<ValidJobFormModel>();
  readonly cancelled = output();

  protected readonly model = linkedSignal(() => this.initialValue());
  protected readonly jobForm = form(this.model, JOB_SCHEMA);

  protected readonly remoteOptions = REMOTE_OPTIONS;
  protected readonly contractOptions = CONTRACT_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly interviewTypeOptions = INTERVIEW_TYPE_OPTIONS;

  protected readonly interviews = computed(() => this.model().interviews);
  protected readonly submitted = signal(false);

  protected hasInterviewError(entry: InterviewFormEntry): boolean {
    return this.submitted() && entry.scheduledAt !== null && entry.type === null;
  }

  protected addInterview(): void {
    this.model.update((m) => ({
      ...m,
      interviews: [...m.interviews, { scheduledAt: null, type: null }],
    }));
  }

  protected removeInterview(index: number): void {
    this.model.update((m) => ({
      ...m,
      interviews: m.interviews.filter((_, i) => i !== index),
    }));
  }

  protected updateInterviewDate(index: number, date: Date | null): void {
    this.model.update((m) => ({
      ...m,
      interviews: m.interviews.map((entry, i) =>
        i === index ? { ...entry, scheduledAt: date } : entry
      ),
    }));
  }

  protected updateInterviewType(index: number, type: InterviewType | null): void {
    this.model.update((m) => ({
      ...m,
      interviews: m.interviews.map((entry, i) =>
        i === index ? { ...entry, type } : entry
      ),
    }));
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);

    const hasIncompleteInterview = this.model().interviews.some(
      (e) => e.scheduledAt !== null && e.type === null
    );
    if (hasIncompleteInterview) return;

    await submit(this.jobForm, async () => {
      const value = this.model();
      if (!isValidJobForm(value)) return;
      this.formSubmit.emit(value);
    });
  }

  protected cancel(): void {
    this.cancelled.emit();
  }
}
