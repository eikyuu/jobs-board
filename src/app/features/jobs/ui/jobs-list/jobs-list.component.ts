import { Component, ChangeDetectionStrategy, OnInit, inject, DOCUMENT, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { JobsState } from '../../data-access/jobs.state';
import { Job, JobStatus } from '../../models/job.model';
import { APPLICATION_TYPE_LABEL, APPLICATION_TYPE_SEVERITY, STATUS_LABEL, STATUS_SEVERITY, TagSeverity } from '../../constants/job-status.const';
import { MessageService, ConfirmationService } from 'primeng/api'
import { environment } from '../../../../../environments/environment';
import { Badge } from "primeng/badge";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { IsOldApplicationPipe } from '../../../../shared/pipes/is-old-application-pipe';

@Component({
  selector: 'app-jobs-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IsOldApplicationPipe, DatePipe, RouterLink, TableModule, TagModule, ButtonModule, Badge, InputTextModule, IconFieldModule, InputIconModule, ConfirmPopupModule],
  styleUrl: './jobs-list.component.scss',
  templateUrl: './jobs-list.component.html',
})
export class JobsListComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly messageService = inject(MessageService)
  private readonly confirmationService = inject(ConfirmationService)
  protected readonly state = inject(JobsState);

  protected readonly searchQuery = signal('');

  protected readonly filteredJobs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.state.applied();
    return this.state.applied().filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.state.load();
  }

  protected statusLabel(status: JobStatus): string {
    return STATUS_LABEL[status];
  }

  protected statusSeverity(status: JobStatus): TagSeverity {
    return STATUS_SEVERITY[status];
  }

  protected applicationTypeLabel(applicationType: Job['applicationType']): string {
    return APPLICATION_TYPE_LABEL[applicationType] || applicationType;
  }

  protected applicationTypeSeverity(applicationType: Job['applicationType']): TagSeverity {
    return APPLICATION_TYPE_SEVERITY[applicationType] || 'secondary';
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

  protected onDelete(event: Event, job: Job): void {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `Supprimer la candidature pour "${job.title}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Non, annuler',
      accept: async () => {
        try {
          await this.state.removeJob(job.id!);
          this.messageService.add({
            severity: 'success',
            summary: 'Supprimé',
            detail: 'La candidature a été supprimée avec succès.',
          });
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la candidature.',
          });
        }
      }
    });
  }
  
  protected exportToPdf(): void {
    const url = `${environment.apiUrl}/jobs/export/pdf`;
    this.document.defaultView?.open(url, '_blank');
  }
}
