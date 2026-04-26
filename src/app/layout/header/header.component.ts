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
  imports: [RouterLink, ButtonComponent, Button],
  styleUrl: './header.component.scss',
  template: `
    <header class="header" role="banner">
      <div class="header__start">
        <button
          class="header__menu-toggle"
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

        <a routerLink="/" class="header__logo" aria-label="templateproject home">
          <span class="header__logo-text">templateproject</span>
        </a>
      </div>

      <nav class="header__end" aria-label="User actions">
        @if (user()) {
          <div class="header__user">
            <span class="header__user-name" aria-hidden="true">{{ user()?.name }}</span>
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
