import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DashboardState } from '../data-access/dashboard.state';
import { ActivityRow, StatCard } from '../data-access/dashboard.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

type TagSeverity = 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';

/** Severity mapping from domain status to PrimeNG tag severity */
const STATUS_SEVERITY: Record<ActivityRow['status'], TagSeverity> = {
  success: 'success',
  warning: 'warn',
  danger: 'danger',
  info: 'info',
};

/**
 * Dashboard page component.
 * Reads state from `DashboardState` and renders KPI cards + activity table.
 */
@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, DatePipe, CardModule, TagModule, ButtonModule, ButtonComponent],
  styleUrl: './dashboard.component.scss',
  template: `
    <div class="dashboard">
      <header class="dashboard__header">
        <div>
          <h1 class="dashboard__title">Dashboard</h1>
          <p class="dashboard__subtitle">Welcome back. Here's what's happening today.</p>
        </div>
        <p-button label="Refresh" (click)="reload()" />
      </header>

      @if (state.isLoading()) {
        <div class="dashboard__loader" role="status" aria-live="polite" aria-label="Loading dashboard data">
          <span class="dashboard__spinner" aria-hidden="true"></span>
          <span class="visually-hidden">Loading…</span>
        </div>
      }

      @if (state.hasError()) {
        <div class="dashboard__error" role="alert">
          <p>{{ state.error() }}</p>
          <p-button severity="secondary" label="Try again" (click)="reload()" />
        </div>
      }

      @if (!state.isLoading() && !state.hasError()) {
        <!-- KPI cards -->
        <section aria-label="Key performance indicators">
          <ul class="dashboard__stats" role="list">
            @for (stat of state.stats(); track stat.id) {
              <li>
                <p-card class="stat-card">
                  <ng-template pTemplate="content">
                    <p class="stat-card__label">{{ stat.label }}</p>
                    <p class="stat-card__value">
                      {{ stat.value | number }}
                      @if (stat.unit) {
                        <span class="stat-card__unit">{{ stat.unit }}</span>
                      }
                    </p>
                    <p
                      class="stat-card__change"
                      [class.stat-card__change--up]="stat.trend === 'up'"
                      [class.stat-card__change--down]="stat.trend === 'down'"
                      [attr.aria-label]="trendLabel(stat)"
                    >
                      {{ stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→' }}
                      {{ stat.change | number: '1.1-1' }}%
                    </p>
                  </ng-template>
                </p-card>
              </li>
            }
          </ul>
        </section>

        <!-- Recent activity -->
        <section class="dashboard__activity" aria-label="Recent activity">
          <h2 class="dashboard__section-title">Recent Activity</h2>

          @if (state.activity().length === 0) {
            <p class="dashboard__empty">No recent activity to display.</p>
          } @else {
            <div class="activity-table" role="table" aria-label="Recent activity">
              <div class="activity-table__head" role="rowgroup">
                <div class="activity-table__row activity-table__row--head" role="row">
                  <span role="columnheader">Description</span>
                  <span role="columnheader">User</span>
                  <span role="columnheader">Time</span>
                  <span role="columnheader">Status</span>
                </div>
              </div>

              <div class="activity-table__body" role="rowgroup">
                @for (row of state.activity(); track row.id) {
                  <div class="activity-table__row" role="row">
                    <span role="cell" class="activity-table__desc">{{ row.description }}</span>
                    <span role="cell">{{ row.user }}</span>
                    <span role="cell" class="activity-table__time">
                      <time [attr.datetime]="row.timestamp">{{ row.timestamp | date: 'short' }}</time>
                    </span>
                    <span role="cell">
                      <p-tag
                        [severity]="statusSeverity(row.status)"
                        [value]="row.status"
                      />
                    </span>
                  </div>
                }
              </div>
            </div>
          }
        </section>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  protected readonly state = inject(DashboardState);

  ngOnInit(): void {
    this.state.load();
  }

  protected reload(): void {
    this.state.load();
  }

  protected statusSeverity(status: ActivityRow['status']): TagSeverity {
    return STATUS_SEVERITY[status];
  }

  protected trendLabel(stat: StatCard): string {
    return `${stat.trend === 'up' ? 'Up' : stat.trend === 'down' ? 'Down' : 'Unchanged'} ${stat.change}% from previous period`;
  }
}
