import type { Observable } from 'rxjs';
import type { LoginDto, LoginResponse } from './auth.model';

export interface AuthRepository {
  login(dto: LoginDto): Observable<LoginResponse>;
}
