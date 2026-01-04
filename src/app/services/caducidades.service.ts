import { Injectable } from '@angular/core';
import {
  AddCaducidadInterface,
  BuscadorCaducidadesInterface,
  BuscadorCaducidadResult,
} from '@interfaces/caducidad.interface';
import { StatusResult } from '@interfaces/interfaces';
import Caducidad from '@model/almacen/caducidad.model';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class CaducidadesService extends BaseService {
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

  getCaducidades(data: BuscadorCaducidadesInterface): Observable<BuscadorCaducidadResult> {
    return this.http.post<BuscadorCaducidadResult>(this.apiUrl + '-almacen/get-caducidades', data);
  }

  addCaducidad(data: AddCaducidadInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-almacen/add-caducidad', data);
  }

  deleteCaducidad(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-almacen/delete-caducidad', { id });
  }
}
