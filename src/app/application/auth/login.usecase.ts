import { Injectable, inject } from '@angular/core';
import { AUTH_REPO } from '../../infrastructure/tokens';
import type { AuthRepository } from '../../domain/auth/auth.repository';
import type { LoginDto } from '../../domain/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly repo = inject<AuthRepository>(AUTH_REPO);
  
  execute(dto: LoginDto) {
    return this.repo.login(dto);
  }
}
