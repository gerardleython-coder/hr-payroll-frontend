import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DownloadPayrollPdfUseCase {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/payroll`;

  execute(payrollRunId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/runs/${payrollRunId}/pdf`, {
      responseType: 'blob',
    });
  }
}
