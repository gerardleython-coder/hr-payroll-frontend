import { Routes } from '@angular/router';
import { EmployeesPage } from '../presentation/pages/employees.page';
import { ContractsPage } from '../presentation/pages/contracts.page';
import { PayrollRunsPage } from '../presentation/pages/payroll-runs.page';
import { PayrollRulesPage } from '../presentation/pages/payroll-rules.page';
import { HealthPage } from '../presentation/pages/health.page';
import { LoginPage } from '../presentation/pages/login.page';
import { authGuard } from '../core/auth/auth.guard';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginPage, title: 'Iniciar Sesión' },
  { path: '', pathMatch: 'full', redirectTo: 'employees' },

  { path: 'employees', component: EmployeesPage, title: 'Empleados', canActivate: [authGuard] },
  { path: 'contracts', component: ContractsPage, title: 'Contratos', canActivate: [authGuard] },
  { path: 'payroll/runs', component: PayrollRunsPage, title: 'Nóminas', canActivate: [authGuard] },
  { path: 'payroll/rules', component: PayrollRulesPage, title: 'Reglas', canActivate: [authGuard] },
  { path: 'health', component: HealthPage, title: 'Estado', canActivate: [authGuard] },

  { path: '**', redirectTo: 'employees' },
];
