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
  styleUrl: './shell.component.scss',
  template: `
    <div class="shell">
      <app-header (menuToggled)="toggleSidebar()" />

      <div class="shell__body">
        <app-sidebar [collapsed]="sidebarCollapsed()" />

        <main class="shell__main" id="main-content" tabindex="-1">
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
