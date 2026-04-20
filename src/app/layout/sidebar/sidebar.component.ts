import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string; // SVG path data
  ariaLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    ariaLabel: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
];

/**
 * Vertical navigation sidebar.
 * Marks active route links using `routerLinkActive`.
 */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './sidebar.component.scss',
  template: `
    <aside
      class="sidebar"
      [class.sidebar--collapsed]="collapsed()"
      aria-label="Main navigation"
    >
      <nav>
        <ul class="sidebar__nav" role="list">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="sidebar__link--active"
                [attr.aria-label]="item.ariaLabel"
                [attr.aria-current]="isActive(item.path) ? 'page' : null"
                class="sidebar__link"
              >
                <svg
                  class="sidebar__icon"
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

                @if (!collapsed()) {
                  <span class="sidebar__label">{{ item.label }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  /** When true, only icons are shown */
  readonly collapsed = input(false);

  protected readonly navItems = NAV_ITEMS;

  protected isActive(_path: string): boolean {
    // routerLinkActive handles this; used only for aria-current
    return false;
  }
}
