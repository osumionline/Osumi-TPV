import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { InformeMensualResult } from '@interfaces/informes.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class InformesService {
  private http: HttpClient = inject(HttpClient);

  getInformeSimple(
    month: number,
    year: number
  ): Observable<InformeMensualResult> {
    return this.http.post<InformeMensualResult>(
      environment.apiUrl + '-informes/get-informe-simple',
      { month, year }
    );
  }

  getInformeDetallado(
    month: number,
    year: number
  ): Observable<InformeMensualResult> {
    return this.http.post<InformeMensualResult>(
      environment.apiUrl + '-informes/get-informe-detallado',
      { month, year }
    );
  }
}
