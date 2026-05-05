import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InterviewsState } from '../../data-access/interviews.state';
import { InterviewType } from '../../models/interview.model';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasInterviews: boolean;
  interviewCount: number;
}

const TYPE_LABEL: Record<InterviewType, string> = {
  phone: 'Téléphone',
  hr: 'RH',
  technical: 'Technique',
  onsite: 'Sur site',
};

const TYPE_SEVERITY: Record<InterviewType, 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
  phone: 'info',
  hr: 'success',
  technical: 'warn',
  onsite: 'danger',
};

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

@Component({
  selector: 'app-interviews-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TagModule, TitleCasePipe, RouterLink],
  templateUrl: './interviews-page.component.html',
  styleUrl: './interviews-page.component.scss',
})
export class InterviewsPageComponent implements OnInit {
  private readonly state = inject(InterviewsState);

  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly sortedInterviews = this.state.sortedInterviews;
  readonly interviewsByDate = this.state.interviewsByDate;

  readonly dayNames = DAY_NAMES;

  protected readonly currentDate = signal(new Date());

  readonly monthLabel = computed(() => {
    const d = this.currentDate();
    return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
  });

  readonly calendarDays = computed((): CalendarDay[] => {
    const d = this.currentDate();
    const year = d.getFullYear();
    const month = d.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday=0 … Sunday=6
    const startOffset = (firstDay.getDay() + 6) % 7;
    const endOffset = (7 - ((lastDay.getDay() + 6) % 7 + 1)) % 7;

    const days: CalendarDay[] = [];

    // Jours du mois précédent pour compléter la première semaine
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(this.buildDay(date, false));
    }

    // Jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(this.buildDay(date, true));
    }

    // Jours du mois suivant pour compléter la dernière semaine
    for (let i = 1; i <= endOffset; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.buildDay(date, false));
    }

    return days;
  });

  /** Entretiens du mois affiché */
  readonly monthInterviews = computed(() => {
    const d = this.currentDate();
    return this.sortedInterviews().filter((interview) => {
      const date = new Date(interview.scheduledAt);
      return date.getFullYear() === d.getFullYear() && date.getMonth() === d.getMonth();
    });
  });

  ngOnInit(): void {
    this.state.load();
  }

  prevMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  isToday(date: Date): boolean {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  isPast(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  typeLabel(type: InterviewType): string {
    return TYPE_LABEL[type] ?? type;
  }

  typeSeverity(type: InterviewType) {
    return TYPE_SEVERITY[type] ?? 'secondary';
  }

  private buildDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const key = this.dateKey(date);
    const interviews = this.interviewsByDate().get(key) ?? [];
    return {
      date,
      isCurrentMonth,
      hasInterviews: interviews.length > 0,
      interviewCount: interviews.length,
    };
  }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
