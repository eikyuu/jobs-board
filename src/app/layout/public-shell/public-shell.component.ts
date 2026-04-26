import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex flex-col min-h-screen bg-[var(--color-surface-ground)]">
      <header
        class="flex items-center justify-center h-[var(--layout-header-height)] border-b border-[var(--color-surface-border)] bg-[var(--color-surface-card)]"
        role="banner"
      >
        <a
          routerLink="/"
          class="inline-flex items-center no-underline focus-visible:outline focus-visible:outline-[var(--color-primary-500)] focus-visible:outline-offset-2 focus-visible:rounded-[var(--radius-sm)]"
          aria-label="templateproject home"
        >
          <span class="text-[var(--font-size-xl)] font-bold text-[var(--color-primary-600)] tracking-[-0.02em]">templateproject</span>
        </a>
      </header>

      <main class="flex-1 flex flex-col focus:outline-none" id="main-content" tabindex="-1">
        <router-outlet />
      </main>

      <footer
        class="py-[var(--space-4)] px-[var(--space-6)] text-center border-t border-[var(--color-surface-border)]"
        role="contentinfo"
      >
        <p class="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">&copy; {{ year }} templateproject. All rights reserved.</p>
      </footer>
    </div>
  `,
})
export class PublicShellComponent {
  protected readonly year = new Date().getFullYear();
}
