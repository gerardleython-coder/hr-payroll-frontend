import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/http/api-client';
import type { CreateEmployeeDto, Employee, UpdateEmployeeDto } from '../../domain/employees/employee.model';
import type { EmployeeRepository } from '../../domain/employees/employee.repository';

@Injectable()
export class HttpEmployeeRepository implements EmployeeRepository {
  private readonly api = inject(ApiClient);
  findAll(): Observable<Employee[]> {
    return this.api.get<Employee[]>('/employees');
  }
  create(dto: CreateEmployeeDto): Observable<Employee> {
    return this.api.post<Employee>('/employees', dto);
  }
  update(id: string, dto: UpdateEmployeeDto): Observable<Employee> {
    return this.api.patch<Employee>(`/employees/${id}`, dto);
  }
}
