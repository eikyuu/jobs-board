import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * Minimal layout wrapper for public (unauthenticated) pages.
 * No sidebar, no user menu — just a branded top bar and a centered content area.
 */
@Component({
  selector: 'app-public-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  styleUrl: './public-shell.component.scss',
  template: `
    <div class="public-shell">
      <header class="public-shell__header" role="banner">
        <a routerLink="/" class="public-shell__logo" aria-label="templateproject home">
          <span class="public-shell__logo-text">templateproject</span>
        </a>
      </header>

      <main class="public-shell__main" id="main-content" tabindex="-1">
        <router-outlet />
      </main>

      <footer class="public-shell__footer" role="contentinfo">
        <p>&copy; {{ year }} templateproject. All rights reserved.</p>
      </footer>
    </div>
  `,
})
export class PublicShellComponent {
  protected readonly year = new Date().getFullYear();
}
