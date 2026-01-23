import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../application/auth/login.usecase';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">HR Payroll</h1>
          <p class="login-subtitle">Inicio de Sesión Administrador</p>
          <p class="login-description">Acceso seguro a registros de empleados y nómina</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="admin"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          @if (error()) {
            <div class="err">{{ error() }}</div>
          }

          <button type="submit" [disabled]="loading() || form.invalid" class="login-button">
            @if (loading()) {
              <span class="loading"></span>
              <span>Iniciando sesión...</span>
            } @else {
              <span>Iniciar Sesión</span>
            }
          </button>
        </form>

        <div class="login-footer">
          <p class="security-notice">
            🔒 Este es un sistema seguro. Los intentos de acceso no autorizados son registrados y reportados.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--bg);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 40px;
      box-shadow: var(--shadow-lg);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-title {
      font-size: 32px;
      font-weight: 900;
      color: var(--accent);
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .login-subtitle {
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      margin: 0 0 8px 0;
    }

    .login-description {
      font-size: 14px;
      color: var(--muted);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      margin: 0;
    }

    .login-button {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 48px;
    }

    .login-footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .security-notice {
      font-size: 12px;
      color: var(--muted);
      text-align: center;
      margin: 0;
      line-height: 1.5;
    }

    .err {
      background: var(--danger-light);
      border: 1px solid var(--danger-border);
      color: var(--danger);
      padding: 12px;
      border-radius: 12px;
      font-size: 14px;
      margin: 0;
    }
  `],
})
export class LoginPage {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set('');

    const dto = this.form.getRawValue();

    this.loginUseCase.execute(dto).subscribe({
      next: (response) => {
        this.authService.saveAuth(response.accessToken, response.user);
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error.set(err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        this.loading.set(false);
      },
    });
  }
}
