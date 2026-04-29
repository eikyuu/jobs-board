import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MessageService } from 'primeng/api';
import { JobsState } from '../../data-access/jobs.state';
import { ValidJobFormModel } from '../../models/job.model';
import { JobFormComponent, DEFAULT_JOB_FORM, jobToFormModel, mapFormToJob } from '../job-form/job-form.component';

@Component({
  selector: 'app-job-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JobFormComponent],
  templateUrl: './job-edit.component.html',
})
export class JobEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly state = inject(JobsState);
  private readonly messageService = inject(MessageService);

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  private readonly jobId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id')!))
  );

  protected readonly job = computed(() =>
    this.state.jobs().find((j) => j.id === this.jobId())
  );

  // Converti Job → JobFormModel pour pré-remplir le formulaire partagé
  protected readonly initialValue = computed(() => {
    const j = this.job();
    return j ? jobToFormModel(j) : DEFAULT_JOB_FORM;
  });

  ngOnInit(): void {
    this.state.load();
  }

  protected async onFormSubmit(value: ValidJobFormModel): Promise<void> {
    const job = this.job();
    if (!job) return;

    this.serverError.set(null);
    this.submitting.set(true);
    try {
      await this.state.updateJob({
        ...mapFormToJob(value),
        id: job.id,
        tags: job.tags,
        contacts: job.contacts,
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Candidature mise à jour',
        detail: 'Les modifications ont été enregistrées.',
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
