import type { Observable } from 'rxjs';
import type { CreateEmployeeDto, Employee, UpdateEmployeeDto } from './employee.model';

export interface EmployeeRepository {
  findAll(): Observable<Employee[]>;
  create(dto: CreateEmployeeDto): Observable<Employee>;
  update(id: string, dto: UpdateEmployeeDto): Observable<Employee>;
}
