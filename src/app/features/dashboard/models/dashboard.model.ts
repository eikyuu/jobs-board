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