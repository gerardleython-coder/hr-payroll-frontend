import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (authService.currentUser()) {
      <div class="nav">
        <div class="bar">
          <div class="brand">HR Payroll</div>
          <div class="links">
            <a class="link" routerLink="/employees" routerLinkActive="active">Empleados</a>
            <a class="link" routerLink="/contracts" routerLinkActive="active">Contratos</a>
            <a class="link" routerLink="/payroll/runs" routerLinkActive="active">Nóminas</a>
            <a class="link" routerLink="/payroll/rules" routerLinkActive="active">Reglas</a>
            <a class="link" routerLink="/health" routerLinkActive="active">Estado</a>
          </div>
          <div class="user-section">
            <span class="user-name">{{ authService.currentUser()?.username }}</span>
            <button class="btn-logout" (click)="logout()">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    }

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }

    .user-name {
      color: var(--text);
      font-size: 14px;
      font-weight: 600;
    }

    .btn-logout {
      padding: 8px 14px;
      font-size: 13px;
      background: var(--panel2);
      border-color: var(--border);
      box-shadow: none;
    }

    .btn-logout:hover {
      background: var(--hover-bg);
    }

    @media (max-width: 768px) {
      .bar {
        flex-wrap: wrap;
      }
      
      .user-section {
        width: 100%;
        justify-content: flex-end;
        margin-left: 0;
        margin-top: 8px;
      }
    }
  `],
})
export class AppComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
