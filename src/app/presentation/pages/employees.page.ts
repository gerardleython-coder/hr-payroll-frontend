/* eslint-disable */
import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AsyncPipe, DatePipe, NgFor, NgIf, DecimalPipe } from '@angular/common';

import type { Employee } from '../../domain/employees/employee.model';
import { ListEmployeesUseCase } from '../../application/employees/list-employees.usecase';
import { CreateEmployeeUseCase } from '../../application/employees/create-employee.usecase';
import { UpdateEmployeeUseCase } from '../../application/employees/update-employee.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, AsyncPipe, DatePipe, DecimalPipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>{{ editingEmployee() ? 'Editar Empleado' : 'Crear Empleado' }}</h2>
      <form [formGroup]="form" (ngSubmit)="editingEmployee() ? update() : create()">
        <label for="name">Nombre</label>
        <input id="name" formControlName="name" placeholder="Ej: Ana Pérez">
        <label for="email">Correo Electrónico</label>
        <input id="email" formControlName="email" placeholder="ana@empresa.com">

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || busy()">
            {{ editingEmployee() ? 'Actualizar' : 'Crear' }}
          </button>
          <button type="button" class="btn-secondary" *ngIf="editingEmployee()" (click)="cancelEdit()">
            Cancelar
          </button>
          <span class="small" *ngIf="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *ngIf="error()">{{ error() }}</div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Empleados</h2>
        <button type="button" class="btn-secondary" (click)="load()">Actualizar</button>
      </div>

      <ng-container *ngIf="employees().length; else empty">
        <div class="table-wrap" style="margin-top:10px;">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>ID</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of employees()">
                <td>{{ e.name }}</td>
                <td class="wrap-anywhere">{{ e.email }}</td>
                <td><span class="small mono wrap-anywhere">{{ e.id }}</span></td>
                <td><span class="small">{{ e.createdAt | date:'short' }}</span></td>
                <td>
                  <button type="button" class="btn-secondary" (click)="edit(e)" style="padding: 6px 12px; font-size: 12px;">
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <ng-template #empty>
        <div class="small">Aún no hay empleados.</div>
      </ng-template>
    </div>
  </div>
  `
})
export class EmployeesPage implements OnInit {
  employees = signal<Employee[]>([]);
  error = signal<string | null>(null);
  busy = signal(false);
  editingEmployee = signal<Employee | null>(null);

  form!: import('@angular/forms').FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly listUc = inject(ListEmployeesUseCase);
  private readonly createUc = inject(CreateEmployeeUseCase);
  private readonly updateUc = inject(UpdateEmployeeUseCase);

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.load();
  }

  load() {
    this.error.set(null);
    this.listUc.execute().subscribe({
      next: (data) => this.employees.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  edit(employee: Employee) {
    this.editingEmployee.set(employee);
    this.form.patchValue({
      name: employee.name,
      email: employee.email,
    });
    this.error.set(null);
  }

  cancelEdit() {
    this.editingEmployee.set(null);
    this.form.reset();
    this.error.set(null);
  }

  create() {
    if (this.form.invalid) return;
    this.error.set(null);
    this.busy.set(true);

    this.createUc.execute(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset();
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
    if (this.form.invalid || !this.editingEmployee()) return;
    this.error.set(null);
    this.busy.set(true);

    const dto = this.form.getRawValue();
    this.updateUc.execute(this.editingEmployee()!.id, dto).subscribe({
      next: () => {
        this.form.reset();
        this.editingEmployee.set(null);
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
