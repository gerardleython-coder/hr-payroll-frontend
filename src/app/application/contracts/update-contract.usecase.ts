import { Injectable, inject } from '@angular/core';
import { CONTRACT_REPO } from '../../infrastructure/tokens';
import type { ContractRepository } from '../../domain/contracts/contract.repository';
import type { UpdateContractDto } from '../../domain/contracts/contract.model';

@Injectable({ providedIn: 'root' })
export class UpdateContractUseCase {
  private readonly repo = inject<ContractRepository>(CONTRACT_REPO);
  
  execute(id: string, dto: UpdateContractDto) {
    return this.repo.update(id, dto);
  }
}
