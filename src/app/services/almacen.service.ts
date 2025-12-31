import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
  InventarioItemInterface,
} from '@interfaces/almacen.interface';
import {
  StatusIdMessageErrorsResult,
  StatusIdMessageResult,
  StatusResult,
} from '@interfaces/interfaces';
import InventarioItem from '@model/almacen/inventario-item.model';
import Articulo from '@model/articulos/articulo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AlmacenService {
  private http: HttpClient = inject(HttpClient);

  buscador: BuscadorAlmacenInterface = {
    idProveedor: null,
    idMarca: null,
    nombre: null,
    descuento: false,
    orderBy: null,
    orderSent: null,
    pagina: 1,
    num: 50,
  };
  list: InventarioItem[] = [];
  pags: number = 0;
  pageIndex: number = 0;
  firstLoad: boolean = true;

  getInventario(data: BuscadorAlmacenInterface): Observable<BuscadorAlmacenResult> {
    return this.http.post<BuscadorAlmacenResult>(
      environment.apiUrl + '-almacen/get-inventario',
      data
    );
  }

  saveInventario(item: InventarioItemInterface): Observable<StatusIdMessageResult> {
    return this.http.post<StatusIdMessageResult>(
      environment.apiUrl + '-almacen/save-inventario',
      item
    );
  }

  saveAllInventario(list: InventarioItemInterface[]): Observable<StatusIdMessageErrorsResult> {
    return this.http.post<StatusIdMessageErrorsResult>(
      environment.apiUrl + '-almacen/save-all-inventario',
      { list }
    );
  }

  deleteInventario(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '-almacen/delete-inventario', { id });
  }

  exportInventario(data: BuscadorAlmacenInterface) {
    return this.http.post(environment.apiUrl + '-almacen/export-inventario', data, {
      responseType: 'text',
    });
  }

  updateArticulo(articulo: Articulo): void {
    for (const item of this.list) {
      if (item.id === articulo.id) {
        item.marca = articulo.marca;
        item.referencia = articulo.referencia;
        item.nombre = articulo.nombre;
        item.stock = articulo.stock;
        item._stock = articulo.stock;
        item.puc = articulo.puc;
        item.pvp = articulo.pvp;
        item._pvp = articulo.pvp;
        item.hasCodigosBarras = articulo.hasCodigoBarras;
      }
    }
  }
}
