import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { JobsState } from '../data-access/jobs.state';
import { Job, JobStatus } from '../../../core/models/job.model';

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
  imports: [DatePipe, TableModule, TagModule],
  styleUrl: './jobs-list.component.scss',
  template: `
    <div class="p-8">
      <header class="mb-6">
        <h1 class="text-2xl font-semibold m-0 mb-1">Mes candidatures</h1>
        <p class="text-sm text-gray-500 m-0">{{ state.applied().length }} offre(s) où vous avez postulé</p>
      </header>

      @if (state.loading()) {
        <div class="flex items-center gap-2 py-8" role="status" aria-live="polite" aria-label="Chargement des offres">
          <span aria-hidden="true" class="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span class="visually-hidden">Chargement…</span>
        </div>
      }

      @if (state.hasError()) {
        <div class="text-red-600 bg-red-50 rounded-lg p-4" role="alert">
          <p class="m-0">{{ state.error() }}</p>
        </div>
      }

      @if (!state.loading() && !state.hasError()) {
        <p-table
          [value]="state.applied()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 25]"
          sortMode="multiple"
          [tableStyle]="{ 'min-width': '60rem' }"
          styleClass="p-datatable-sm"
          aria-label="Liste des candidatures"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title" scope="col">
                Poste <p-sortIcon field="title" />
              </th>
              <th pSortableColumn="company" scope="col">
                Entreprise <p-sortIcon field="company" />
              </th>
              <th pSortableColumn="location" scope="col">
                Lieu <p-sortIcon field="location" />
              </th>
              <th scope="col">Remote</th>
              <th pSortableColumn="contractType" scope="col">
                Contrat <p-sortIcon field="contractType" />
              </th>
              <th scope="col">Salaire</th>
              <th pSortableColumn="status" scope="col">
                Statut <p-sortIcon field="status" />
              </th>
              <th pSortableColumn="appliedAt" scope="col">
                Candidaté le <p-sortIcon field="appliedAt" />
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-job>
            <tr>
              <td>
                @if (job.url) {
                  <a [href]="job.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                    {{ job.title }}
                  </a>
                } @else {
                  {{ job.title }}
                }
              </td>
              <td>{{ job.company }}</td>
              <td>{{ job.location }}</td>
              <td>{{ remoteLabel(job.remote) }}</td>
              <td>{{ job.contractType }}</td>
              <td>{{ salaryLabel(job) }}</td>
              <td>
                <p-tag
                  [value]="statusLabel(job.status)"
                  [severity]="statusSeverity(job.status)"
                />
              </td>
              <td>
                <time [attr.datetime]="job.appliedAt">
                  {{ job.appliedAt | date: 'dd/MM/yyyy' }}
                </time>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-8 text-gray-400">Aucune candidature trouvée.</td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
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
}
