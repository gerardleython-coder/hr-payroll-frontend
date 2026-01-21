import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
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
      </div>
    </div>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
