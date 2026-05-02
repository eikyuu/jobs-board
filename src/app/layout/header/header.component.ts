import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Button } from "primeng/button";

/**
 * Top-level application header.
 * Displays the app logo, page title area, and user actions (logout).
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button],
  template: `
    <header class="flex items-center justify-between h-16 px-6 bg-white  border-b border-neutral-200 shadow-sm sticky top-0 z-50" role="banner">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center justify-center w-9 h-9 p-0 bg-transparent border-0 rounded-md text-neutral-500 cursor-pointer transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          type="button"
          [attr.aria-label]="'Toggle navigation menu'"
          (click)="menuToggled.emit()"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <a routerLink="/" class="flex items-center gap-2 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 focus-visible:rounded-sm" aria-label="vincentduguet board home">
          <span class="text-xl font-bold text-primary-600 tracking-tight">vincentduguet board</span>
        </a>
      </div>

      <nav class="flex items-center gap-4 hidden md:block" aria-label="User actions">
        @if (user()) {
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-neutral-500" aria-hidden="true">{{ user()?.name }}</span>
            <p-button label="Log out" (click)="logout()" aria-label="Log out" severity="secondary" />
          </div>
        }
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;

  /** Emits when the hamburger menu button is pressed */
  readonly menuToggled = output<void>();

  logout(): void {
    this.authService.logout();
  }
}
