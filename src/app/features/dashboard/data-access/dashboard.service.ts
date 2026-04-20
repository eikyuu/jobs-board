import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

/** Key performance metric */
export interface StatCard {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change: number; // percentage vs previous period
  trend: 'up' | 'down' | 'neutral';
}

/** Summary row shown in the recent-activity table */
export interface ActivityRow {
  id: string;
  description: string;
  user: string;
  timestamp: string; // ISO-8601
  status: 'success' | 'warning' | 'danger' | 'info';
}

export interface DashboardData {
  stats: StatCard[];
  recentActivity: ActivityRow[];
}

/**
 * Data-access service for the Dashboard feature.
 * All methods return typed Observables and never throw directly.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/dashboard`;

  /**
   * Fetches all dashboard data (stats + activity) in a single request.
   */
  getDashboardData(): Observable<DashboardData> {
    if (!environment.production) {
      const mockData: DashboardData = {
        stats: [
          {
            id: 'revenue',
            label: 'Revenue',
            value: 125000,
            unit: 'USD',
            change: 12.5,
            trend: 'up',
          },
          {
            id: 'users',
            label: 'Active Users',
            value: 3500,
            change: -8.2,
            trend: 'down',
          },
          {
            id: 'orders',
            label: 'Orders',
            value: 420,
            change: 0,
            trend: 'neutral',
          },
        ],
        recentActivity: [
          {
            id: '1',
            description: 'New order #1234 placed by John Doe',
            user: 'John Doe',
            timestamp: new Date().toISOString(),
            status: 'success',
          },
          {
            id: '2',
            description: 'Payment failed for order #1235',
            user: 'Jane Smith',
            timestamp: new Date().toISOString(),
            status: 'danger',
          },
          {
            id: '3',
            description: 'New user registration: Jane Smith',
            user: 'Jane Smith',
            timestamp: new Date().toISOString(),
            status: 'info',
          },
        ],
      };

      return of(mockData).pipe(delay(1000));
    } else {
      return this.http.get<DashboardData>(this.base);
    }
  }

  /**
   * Fetches only KPI stat cards.
   */
  getStats(): Observable<StatCard[]> {
    if (!environment.production) {
      const mockStats: StatCard[] = [
        {
          id: 'revenue',
          label: 'Revenue',
          value: 125000,
          unit: 'USD',
          change: 12.5,
          trend: 'up',
        },
        {
          id: 'users',
          label: 'Active Users',
          value: 3500,
          change: -8.2,
          trend: 'down',
        },
        {
          id: 'orders',
          label: 'Orders',
          value: 420,
          change: 0,
          trend: 'neutral',
        },
      ];

      return of(mockStats).pipe(delay(1000));
    } else {
      return this.http.get<StatCard[]>(`${this.base}/stats`);
    }
  }

  /**
   * Fetches recent activity rows, optionally limited.
   * @param limit - maximum rows to return (default: 10)
   */
  getRecentActivity(limit = 10): Observable<ActivityRow[]> {
    if (!environment.production) {
      const mockActivity: ActivityRow[] = [
        {
          id: '1',
          description: 'New order #1234 placed by John Doe',
          user: 'John Doe',
          timestamp: new Date().toISOString(),
          status: 'success',
        },
        {
          id: '2',
          description: 'Payment failed for order #1235',
          user: 'Jane Smith',
          timestamp: new Date().toISOString(),
          status: 'danger',
        },
        {
          id: '3',
          description: 'New user registration: Jane Smith',
          user: 'Jane Smith',
          timestamp: new Date().toISOString(),
          status: 'info',
        },
      ];

      return of(mockActivity).pipe(delay(1000));
    } else {
      return this.http.get<ActivityRow[]>(`${this.base}/activity`, {
        params: { limit: String(limit) },
      });
    }
  }
}
