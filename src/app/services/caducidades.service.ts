import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  BuscadorCaducidadesInterface,
  BuscadorCaducidadResult,
} from '@interfaces/caducidad.interface';
import Caducidad from '@model/almacen/caducidad.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class CaducidadesService {
  private http: HttpClient = inject(HttpClient);

  buscador: BuscadorCaducidadesInterface = {
    year: null,
    month: null,
    pagina: 1,
    num: 50,
    idMarca: null,
    nombre: null,
    orderBy: null,
    orderSent: null,
  };
  list: Caducidad[] = [];
  pags: number = 0;
  pageIndex: number = 0;
  firstLoad: boolean = true;

  getCaducidades(
    data: BuscadorCaducidadesInterface
  ): Observable<BuscadorCaducidadResult> {
    return this.http.post<BuscadorCaducidadResult>(
      environment.apiUrl + '-almacen/get-caducidades',
      data
    );
  }
}
