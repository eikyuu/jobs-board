import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { JobsState } from '../../data-access/jobs.state';
import { Job, JobStatus } from '../../../../core/models/job.model';

type TagSeverity = 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';

const STATUS_LABEL: Record<JobStatus, string> = {
  saved: 'Sauvegardé',
  applied: 'Candidaté',
  interview: 'Entretien',
  offer: 'Offre',
  rejected: 'Refus',
};

const STATUS_SEVERITY: Record<JobStatus, TagSeverity> = {
  saved: 'secondary',
  applied: 'info',
  interview: 'warn',
  offer: 'success',
  rejected: 'danger',
};

@Component({
  selector: 'app-jobs-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, TableModule, TagModule, ButtonModule],
  styleUrl: './jobs-list.component.scss',
  templateUrl: './jobs-list.component.html',
})
export class JobsListComponent implements OnInit {
  protected readonly state = inject(JobsState);

  ngOnInit(): void {
    this.state.load();
  }

  protected statusLabel(status: JobStatus): string {
    return STATUS_LABEL[status];
  }

  protected statusSeverity(status: JobStatus): TagSeverity {
    return STATUS_SEVERITY[status];
  }

  protected remoteLabel(remote: Job['remote']): string {
    const labels: Record<Job['remote'], string> = {
      onsite: 'Présentiel',
      hybrid: 'Hybride',
      full: 'Full remote',
    };
    return labels[remote];
  }

  protected salaryLabel(job: Job): string {
    if (!job.salary) return '—';
    const { min, max, currency } = job.salary;
    return `${(min / 1000).toFixed(0)}–${(max / 1000).toFixed(0)}k ${currency}`;
  }

  protected onDelete(job: Job): void {
    if (confirm(`Supprimer la candidature pour "${job.title}" ?`)) {
      this.state.removeJob(job.id);
    }
  }
}
