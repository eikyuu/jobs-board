import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';

/** Visual style variant of the button */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';

/** Size of the button */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Native button type attribute */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Accessible, polymorphic button component.
 *
 * Renders a `<button>` by default. When `href` is provided the inner
 * element becomes an `<a>` tag, supporting both external URLs and
 * Angular Router links.
 *
 * @example
 * <app-button variant="primary" (clicked)="save()">Save</app-button>
 * <app-button href="/dashboard" variant="link">Go to dashboard</app-button>
 */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styleUrl: './button.component.scss',
  template: `
    @if (href()) {
      <a
        [routerLink]="isExternal() ? null : href()"
        [attr.href]="isExternal() ? href() : null"
        [attr.target]="isExternal() ? '_blank' : null"
        [attr.rel]="isExternal() ? 'noopener noreferrer' : null"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-disabled]="disabled() || null"
        [attr.tabindex]="disabled() ? -1 : 0"
        [class]="hostClasses()"
      >
        <ng-content />
      </a>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled() || loading()"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-busy]="loading() || null"
        [attr.aria-disabled]="disabled() || null"
        [class]="hostClasses()"
        (click)="handleClick()"
      >
        @if (loading()) {
          <span class="btn__spinner" aria-hidden="true"></span>
        }
        <ng-content />
      </button>
    }
  `,
})
export class ButtonComponent {
  /** Visual variant */
  readonly variant = input<ButtonVariant>('primary');

  /** Size */
  readonly size = input<ButtonSize>('md');

  /** Native type — only applies when rendering as <button> */
  readonly type = input<ButtonType>('button');

  /** When set, renders an anchor tag pointing to this URL or route path */
  readonly href = input<string | undefined>(undefined);

  /** Accessible label — use when button content is icon-only */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Disables interaction and applies disabled styling */
  readonly disabled = input(false);

  /** Shows a spinner and disables the button */
  readonly loading = input(false);

  /** Full-width block button */
  readonly block = input(false);

  /** Emits when the button is clicked (only when not disabled/loading) */
  readonly clicked = output<void>();

  protected readonly isExternal = computed(() => {
    const h = this.href();
    return !!h && (h.startsWith('http://') || h.startsWith('https://'));
  });

  protected readonly hostClasses = computed(() => {
    const classes = [
      'btn',
      `btn--${this.variant()}`,
      `btn--${this.size()}`,
    ];
    if (this.disabled()) classes.push('btn--disabled');
    if (this.loading()) classes.push('btn--loading');
    if (this.block()) classes.push('btn--block');
    return classes.join(' ');
  });

  protected handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
