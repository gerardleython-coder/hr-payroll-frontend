import type { Observable } from 'rxjs';
import type { Contract, CreateContractDto, UpdateContractDto } from './contract.model';

export interface ContractRepository {
  findAll(): Observable<Contract[]>;
  create(dto: CreateContractDto): Observable<Contract>;
  update(id: string, dto: UpdateContractDto): Observable<Contract>;
}
