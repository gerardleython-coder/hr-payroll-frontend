import { Injectable, inject } from '@angular/core';
import { EMPLOYEE_REPO } from '../../infrastructure/tokens';
import type { EmployeeRepository } from '../../domain/employees/employee.repository';
import type { UpdateEmployeeDto } from '../../domain/employees/employee.model';

@Injectable({ providedIn: 'root' })
export class UpdateEmployeeUseCase {
  private readonly repo = inject<EmployeeRepository>(EMPLOYEE_REPO);
  
  execute(id: string, dto: UpdateEmployeeDto) {
    return this.repo.update(id, dto);
  }
}
