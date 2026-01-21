import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AuthRepository } from '../../domain/auth/auth.repository';
import type { LoginDto, LoginResponse } from '../../domain/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthHttpRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, dto);
  }
}
