import { Component, ChangeDetectionStrategy, model, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AuthService } from '../../core/core.providers';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  ariaLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    ariaLabel: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Mes candiatures',
    path: '/jobs',
    ariaLabel: 'Mes candidatures',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
    {
    label: 'Mes entretiens',
    path: '/interviews',
    ariaLabel: 'Calendrier des entretiens',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Flash Cards',
    path: '/flashcards',
    ariaLabel: 'Flash Cards — questions entretien',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  }
];

/**
 * Vertical navigation sidebar.
 * Marks active route links using `routerLinkActive`.
 */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DrawerModule, ButtonModule],
  template: `
  <div>
    <p-drawer
      aria-label="Main navigation"
      [(visible)]="visible"
    >
      <nav>
        <ul role="list" class="flex flex-col gap-1 p-2">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="!bg-indigo-50 !text-indigo-700"
                [attr.aria-label]="item.ariaLabel"
                [attr.aria-current]="isActive() ? 'page' : null"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
              >
                <svg
                  class="shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  width="20"
                  height="20"
                >
                  <path [attr.d]="item.icon" />
                </svg>

                @if (visible()) {
                  <span class="truncate">{{ item.label }}</span>
                }
              </a>
            </li>
          }
        </ul>

          @if (user()) {
          <div class="block md:hidden flex items-center gap-3 justify-end mt-6 px-3">
            <span class="text-sm font-medium text-neutral-500" aria-hidden="true">{{ user()?.name }}</span>
            <p-button label="Log out" (click)="logout()" aria-label="Log out" severity="secondary" />
          </div>
        }

      </nav>
    </p-drawer>
  </div>

  `,
})
export class SidebarComponent {

  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;

  readonly visible = model(false);

  protected readonly navItems = NAV_ITEMS;

  protected isActive(): boolean {
    return false;
  }

  logout(): void {
    this.authService.logout();
  }
}
