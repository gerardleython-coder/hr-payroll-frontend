/* eslint-disable */
import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor, DatePipe, DecimalPipe } from '@angular/common';

import type { Contract } from '../../domain/contracts/contract.model';
import type { Employee } from '../../domain/employees/employee.model';
import type { ContractType } from '../../domain/shared/contract-type';

import { ListEmployeesUseCase } from '../../application/employees/list-employees.usecase';
import { ListContractsUseCase } from '../../application/contracts/list-contracts.usecase';
import { CreateContractUseCase } from '../../application/contracts/create-contract.usecase';
import { UpdateContractUseCase } from '../../application/contracts/update-contract.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DatePipe, DecimalPipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>{{ editingContract() ? 'Editar Contrato' : 'Crear Contrato' }}</h2>

      <form [formGroup]="form" (ngSubmit)="editingContract() ? update() : create()">
        <label for="employeeId">Empleado</label>
        <select id="employeeId" formControlName="employeeId" [disabled]="!!editingContract()">
          <option value="">-- Selecciona --</option>
          <option *ngFor="let e of employees()" [value]="e.id">{{ e.name }} ({{ e.email }})</option>
        </select>

        <label for="contractType">Tipo de Contrato</label>
        <select id="contractType" formControlName="contractType">
          <option value="EMPLOYEE">EMPLEADO</option>
          <option value="CONTRACTOR">CONTRATISTA</option>
        </select>

        <label for="baseSalary">Salario Base</label>
        <input id="baseSalary" type="number" formControlName="baseSalary" placeholder="Ej: 3000000">

        <label style="display:flex; align-items:center; gap:10px; margin-top:12px;">
          <input type="checkbox" formControlName="active" style="width:auto">
          <span>Activo</span>
        </label>

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || busy()">
            {{ editingContract() ? 'Actualizar' : 'Crear' }}
          </button>
          <button type="button" class="btn-secondary" *ngIf="editingContract()" (click)="cancelEdit()">
            Cancelar
          </button>
          <span class="small" *ngIf="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *ngIf="error()">{{ error() }}</div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Contratos</h2>
        <button type="button" class="btn-secondary" (click)="load()">Actualizar</button>
      </div>

      <ng-container *ngIf="contracts().length; else empty">
        <div class="table-wrap" style="margin-top:10px;">
          <table>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Tipo</th>
                <th>Salario</th>
                <th>Estado</th>
                <th>ID</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of contracts()">
                <td>
                  <span class="small wrap-anywhere">{{ employeeName(c.employeeId) }}</span>
                </td>
                <td><span class="pill">{{ c.contractType === 'EMPLOYEE' ? 'EMPLEADO' : 'CONTRATISTA' }}</span></td>
                <td>{{ c.baseSalary | number }}</td>
                <td>
                  <span class="pill" [class.ok]="c.active" [class.bad]="!c.active">
                    {{ c.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td><span class="small mono wrap-anywhere">{{ c.id }}</span></td>
                <td><span class="small">{{ c.createdAt | date:'short' }}</span></td>
                <td>
                  <button type="button" class="btn-secondary" (click)="edit(c)" style="padding: 6px 12px; font-size: 12px;">
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <ng-template #empty>
        <div class="small">Aún no hay contratos.</div>
      </ng-template>
    </div>
  </div>
  `
})
export class ContractsPage implements OnInit {
  employees = signal<Employee[]>([]);
  contracts = signal<Contract[]>([]);
  error = signal<string | null>(null);
  busy = signal(false);
  editingContract = signal<Contract | null>(null);

  form!: import('@angular/forms').FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly listEmployees = inject(ListEmployeesUseCase);
  private readonly listContracts = inject(ListContractsUseCase);
  private readonly createContract = inject(CreateContractUseCase);
  private readonly updateContract = inject(UpdateContractUseCase);

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      employeeId: ['', [Validators.required]],
      contractType: ['EMPLOYEE' as unknown as ContractType, [Validators.required]],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      active: [true],
    });
    this.load();
  }

  load() {
    this.error.set(null);

    this.listEmployees.execute().subscribe({
      next: (data) => this.employees.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });

    this.listContracts.execute().subscribe({
      next: (data) => this.contracts.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  employeeName(employeeId: string) {
    const e = this.employees().find(x => x.id === employeeId);
    return e ? `${e.name} — ${e.email}` : employeeId;
  }

  edit(contract: Contract) {
    this.editingContract.set(contract);
    this.form.patchValue({
      employeeId: contract.employeeId,
      contractType: contract.contractType,
      baseSalary: contract.baseSalary,
      active: contract.active,
    });
    this.error.set(null);
  }

  cancelEdit() {
    this.editingContract.set(null);
    this.form.reset({
      employeeId: '',
      contractType: 'EMPLOYEE',
      baseSalary: 0,
      active: true,
    });
    this.error.set(null);
  }

  create() {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set(null);

    this.createContract.execute(this.form.getRawValue()).subscribe({
      next: () => {
        this.busy.set(false);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(String(e?.message ?? e));
      },
    });
  }

  update() {
    if (this.form.invalid || !this.editingContract()) return;
    this.busy.set(true);
    this.error.set(null);

    const dto = {
      contractType: this.form.get('contractType')?.value,
      baseSalary: this.form.get('baseSalary')?.value,
      active: this.form.get('active')?.value,
    };

    this.updateContract.execute(this.editingContract()!.id, dto).subscribe({
      next: () => {
        this.editingContract.set(null);
        this.form.reset({
          employeeId: '',
          contractType: 'EMPLOYEE',
          baseSalary: 0,
          active: true,
        });
        this.busy.set(false);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(String(e?.message ?? e));
      },
    });
  }
}
