/* eslint-disable */
import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf, DatePipe, JsonPipe, DecimalPipe } from '@angular/common';

import type { Employee } from '../../domain/employees/employee.model';
import type { Contract } from '../../domain/contracts/contract.model';
import type { PayrollRun } from '../../domain/payroll/payroll-run.model';

import { ListEmployeesUseCase } from '../../application/employees/list-employees.usecase';
import { ListContractsUseCase } from '../../application/contracts/list-contracts.usecase';
import { CreatePayrollRunUseCase } from '../../application/payroll/create-payroll-run.usecase';
import { ListPayrollRunsUseCase } from '../../application/payroll/list-payroll-runs.usecase';
import { DownloadPayrollPdfUseCase } from '../../application/payroll/download-payroll-pdf.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DatePipe, JsonPipe, DecimalPipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>Crear Nómina</h2>

      <form [formGroup]="form" (ngSubmit)="createRun()">
        <label for="pr-employeeId">Empleado</label>
        <select id="pr-employeeId" formControlName="employeeId">
          <option value="">-- Selecciona --</option>
          <option *ngFor="let e of employees()" [value]="e.id">{{ e.name }} ({{ e.email }})</option>
        </select>

        <label for="pr-period">Período (YYYY-MM)</label>
        <input id="pr-period" formControlName="period" placeholder="2026-01">

        <label for="pr-contractId">Contrato (opcional)</label>
        <select id="pr-contractId" formControlName="contractId">
          <option value="">-- Auto: contrato activo más reciente --</option>
          <option *ngFor="let c of contractsForSelectedEmployee()" [value]="c.id">
            {{ c.contractType === 'EMPLOYEE' ? 'EMPLEADO' : 'CONTRATISTA' }} — {{ c.baseSalary | number }} — {{ c.active ? 'activo' : 'inactivo' }}
          </option>
        </select>

        <label for="pr-bonuses">Bonos (opcional)</label>
        <input id="pr-bonuses" type="number" formControlName="bonuses" placeholder="0">

        <label for="pr-otherDeductions">Otras Deducciones (opcional)</label>
        <input id="pr-otherDeductions" type="number" formControlName="otherDeductions" placeholder="0">

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || busy()">Calcular Nómina</button>
          <span class="small" *ngIf="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *ngIf="error()">{{ error() }}</div>

      <div *ngIf="lastCreated() as r" style="margin-top:14px;">
        <div class="small">Última nómina creada:</div>
        <div class="row" style="margin-top:10px;">
          <div class="col card" style="padding:12px;">
            <div><b>Período:</b> {{ r.period }}</div>
            <div><b>Salario Bruto:</b> {{ r.gross | number }}</div>
            <div><b>Salario Neto:</b> {{ r.net | number }}</div>
            <div class="small">ID: {{ r.id }}</div>
          </div>
        </div>
        <pre class="pre-wrap">{{ formatBreakdown(r.breakdown) }}</pre>
      </div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Histórico de Nóminas</h2>
        <button type="button" class="btn-secondary" (click)="loadRuns()">Actualizar</button>
      </div>

      <div class="row" style="margin-top:8px;">
        <div class="col" style="flex:1 1 260px;">
          <label for="filter-employee">Filtrar por Empleado</label>
          <select id="filter-employee" [value]="filters().employeeId ?? ''" (change)="setEmployeeFilter($any($event.target).value)">
            <option value="">-- Todos --</option>
            <option *ngFor="let e of employees()" [value]="e.id">{{ e.name }}</option>
          </select>
        </div>
        <div class="col" style="flex:1 1 220px;">
          <label for="filter-period">Filtrar por Período</label>
          <input id="filter-period" [value]="filters().period ?? ''" (input)="setPeriodFilter($any($event.target).value)" placeholder="2026-01">
        </div>
        <div class="col" style="flex:0 0 160px; align-self:end;">
          <button type="button" (click)="loadRuns()">Aplicar</button>
        </div>
      </div>

      <ng-container *ngIf="runs().length; else empty">
        <div class="table-wrap" style="margin-top:10px;">
          <table>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Período</th>
                <th>Salario Bruto</th>
                <th>Salario Neto</th>
                <th>Fecha de Creación</th>
                <th>Desglose</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of runs()">
                <td>
                  <div class="wrap-anywhere">{{ r.employee?.name ?? r.employeeId }}</div>
                  <div class="small wrap-anywhere">{{ r.employee?.email ?? '' }}</div>
                </td>
                <td><span class="pill">{{ r.period }}</span></td>
                <td>{{ r.gross | number }}</td>
                <td>{{ r.net | number }}</td>
                <td><span class="small">{{ r.createdAt | date:'short' }}</span></td>
                <td>
                  <details>
                    <summary class="small">ver</summary>
                    <pre class="pre-wrap">{{ formatBreakdown(r.breakdown) }}</pre>
                  </details>
                </td>
                <td>
                  <button 
                    type="button" 
                    class="btn-secondary" 
                    (click)="downloadPdf(r)" 
                    [disabled]="downloadingId() === r.id"
                    style="padding: 6px 12px; font-size: 12px;">
                    {{ downloadingId() === r.id ? 'Descargando...' : 'Descargar PDF' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <ng-template #empty>
        <div class="small">Aún no hay nóminas.</div>
      </ng-template>
    </div>
  </div>
  `
})
export class PayrollRunsPage implements OnInit {
  employees = signal<Employee[]>([]);
  contracts = signal<Contract[]>([]);
  runs = signal<PayrollRun[]>([]);
  lastCreated = signal<PayrollRun | null>(null);

  error = signal<string | null>(null);
  busy = signal(false);
  downloadingId = signal<string | null>(null);

  filters = signal<{ employeeId?: string; period?: string }>({});

  form!: import('@angular/forms').FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly listEmployees = inject(ListEmployeesUseCase);
  private readonly listContracts = inject(ListContractsUseCase);
  private readonly createRunUc = inject(CreatePayrollRunUseCase);
  private readonly listRunsUc = inject(ListPayrollRunsUseCase);
  private readonly downloadPdfUc = inject(DownloadPayrollPdfUseCase);

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      employeeId: ['', [Validators.required]],
      period: ['', [Validators.required, Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])$/)]],
      contractId: [''],
      bonuses: [0],
      otherDeductions: [0],
    });

    this.bootstrap();
  }

  bootstrap() {
    this.error.set(null);
    this.listEmployees.execute().subscribe({
      next: (data) => this.employees.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });

    this.listContracts.execute().subscribe({
      next: (data) => this.contracts.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });

    this.loadRuns();
  }

  contractsForSelectedEmployee() {
    const employeeId = this.form.get('employeeId')?.value;
    if (!employeeId) return [];
    return this.contracts().filter(c => c.employeeId === employeeId);
  }

  setEmployeeFilter(v: string) {
    const next = { ...this.filters(), employeeId: v || undefined };
    this.filters.set(next);
  }

  setPeriodFilter(v: string) {
    const cleaned = (v ?? '').trim();
    const next = { ...this.filters(), period: cleaned || undefined };
    this.filters.set(next);
  }

  loadRuns() {
    this.error.set(null);
    this.listRunsUc.execute(this.filters()).subscribe({
      next: (data) => this.runs.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  createRun() {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const dto = {
      employeeId: raw.employeeId,
      period: raw.period,
      contractId: raw.contractId || undefined,
      bonuses: Number(raw.bonuses ?? 0) || 0,
      otherDeductions: Number(raw.otherDeductions ?? 0) || 0,
    };

    this.createRunUc.execute(dto).subscribe({
      next: (created) => {
        this.lastCreated.set(created);
        this.busy.set(false);
        this.loadRuns();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(String(e?.message ?? e));
      },
    });
  }

  formatBreakdown(breakdown: any): string {
    if (!breakdown) return '';
    
    const translations: Record<string, string> = {
      'net': 'Salario Neto',
      'gross': 'Salario Bruto',
      'taxes': 'Impuestos',
      'health': 'Salud',
      'pension': 'Pensión',
      'withholding': 'Retención',
      'otherDeductions': 'Otras Deducciones',
      'mandatoryDeductions': 'Deducciones Obligatorias'
    };

    const translated: Record<string, any> = {};
    for (const [key, value] of Object.entries(breakdown)) {
      const translatedKey = translations[key] || key;
      translated[translatedKey] = value;
    }

    return JSON.stringify(translated, null, 2);
  }

  downloadPdf(run: PayrollRun): void {
    this.downloadingId.set(run.id);
    this.error.set(null);

    this.downloadPdfUc.execute(run.id).subscribe({
      next: (blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generar nombre de archivo descriptivo
        const employeeName = run.employee?.name || 'empleado';
        const sanitizedName = employeeName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        link.download = `nomina-${run.period}-${sanitizedName}.pdf`;
        
        // Simular click para descargar
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.downloadingId.set(null);
      },
      error: (e) => {
        this.downloadingId.set(null);
        this.error.set(`Error al descargar PDF: ${String(e?.message ?? e)}`);
      },
    });
  }
}
