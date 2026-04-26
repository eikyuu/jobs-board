import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

/**
 * Application shell — the authenticated layout wrapper.
 * Composes the header, sidebar, and main content area (router outlet).
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex flex-col h-screen overflow-hidden">
      <app-header (menuToggled)="toggleSidebar()" />

      <div class="flex flex-1 overflow-hidden">
        <app-sidebar [collapsed]="sidebarCollapsed()" />

        <main class="flex-1 overflow-y-auto p-[var(--space-6)] bg-[var(--color-surface-ground)] [scrollbar-width:thin] focus:outline-none" id="main-content" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {
  protected readonly sidebarCollapsed = signal(false);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
