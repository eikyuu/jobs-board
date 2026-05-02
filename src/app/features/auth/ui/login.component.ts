import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Button } from "primeng/button";

/**
 * Login page component.
 * Uses a reactive form with PrimeNG inputs.
 * Accessible: labels linked to inputs, error messages via aria-describedby.
 */
@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, CardModule, Button],
  styleUrl: './login.component.scss',
  template: `
    <div class="login-page" role="main">
      <p-card class="login-card">
        <ng-template pTemplate="header">
          <div class="login-card__header">
            <h1 class="login-card__title">Welcome back</h1>
            <p class="login-card__subtitle">Sign in to your account</p>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <form
            [formGroup]="form"
            (ngSubmit)="submit()"
            class="login-form"
            novalidate
            aria-label="Login form"
          >
            @if (serverError()) {
              <div class="login-form__error" role="alert" aria-live="assertive">
                {{ serverError() }}
              </div>
            }

            <div class="form-field">
              <label for="email" class="form-field__label">
                Email address
                <span class="form-field__required" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                type="email"
                pInputText
                formControlName="email"
                autocomplete="email"
                placeholder="you@example.com"
                [attr.aria-describedby]="emailError() ? 'email-error' : null"
                [attr.aria-invalid]="emailError() ? true : null"
                class="form-field__input"
              />
              @if (emailError()) {
                <span id="email-error" class="form-field__hint form-field__hint--error" role="alert">
                  {{ emailError() }}
                </span>
              }
            </div>

            <div class="form-field">
              <label for="password" class="form-field__label">
                Password
                <span class="form-field__required" aria-hidden="true">*</span>
              </label>
              <p-password
                inputId="password"
                formControlName="password"
                [feedback]="false"
                [toggleMask]="true"
                autocomplete="current-password"
                [attr.aria-describedby]="passwordError() ? 'password-error' : null"
                [attr.aria-invalid]="passwordError() ? true : null"
                styleClass="form-field__input"
              />
              @if (passwordError()) {
                <span id="password-error" class="form-field__hint form-field__hint--error" role="alert">
                  {{ passwordError() }}
                </span>
              }
            </div>
            <p-button type="submit" label="Sign in" [loading]="isLoading()" aria-label="Sign in" [disabled]="form.invalid" />
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly isLoading = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected emailError(): string | null {
    const ctrl = this.form.controls.email;
    if (!ctrl.invalid || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Email is required.';
    if (ctrl.hasError('email')) return 'Enter a valid email address.';
    return null;
  }

  protected passwordError(): string | null {
    const ctrl = this.form.controls.password;
    if (!ctrl.invalid || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Password is required.';
    if (ctrl.hasError('minlength')) return 'Password must be at least 8 characters.';
    return null;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.isLoading.set(false);
        const msg =
          err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
        this.serverError.set(msg);
      },
    });
  }
}
