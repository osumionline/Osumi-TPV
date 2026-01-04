import { Injectable } from '@angular/core';
import { BuscadorCaducidadesInterface } from '@interfaces/caducidad.interface';
import {
  InformeCaducidadesResult,
  InformeDetalladoResult,
  InformeMensualResult,
} from '@interfaces/informes.interface';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class InformesService extends BaseService {
  getInformeSimple(month: number, year: number): Observable<InformeMensualResult> {
    return this.http.post<InformeMensualResult>(this.apiUrl + '-informes/get-informe-simple', {
      month,
      year,
    });
  }

  getInformeDetallado(month: number, year: number): Observable<InformeDetalladoResult> {
    return this.http.post<InformeDetalladoResult>(this.apiUrl + '-informes/get-informe-detallado', {
      month,
      year,
    });
  }

  getInformeCaducidades(data: BuscadorCaducidadesInterface): Observable<InformeCaducidadesResult> {
    return this.http.post<InformeCaducidadesResult>(
      this.apiUrl + '-informes/get-informe-caducidades',
      data
    );
  }
}
