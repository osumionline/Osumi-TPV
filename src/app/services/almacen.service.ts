import { Injectable } from '@angular/core';
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
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AlmacenService extends BaseService {
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
    return this.http.post<BuscadorAlmacenResult>(this.apiUrl + '-almacen/get-inventario', data);
  }

  saveInventario(item: InventarioItemInterface): Observable<StatusIdMessageResult> {
    return this.http.post<StatusIdMessageResult>(this.apiUrl + '-almacen/save-inventario', item);
  }

  saveAllInventario(list: InventarioItemInterface[]): Observable<StatusIdMessageErrorsResult> {
    return this.http.post<StatusIdMessageErrorsResult>(
      this.apiUrl + '-almacen/save-all-inventario',
      { list }
    );
  }

  deleteInventario(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-almacen/delete-inventario', { id });
  }

  exportInventario(data: BuscadorAlmacenInterface) {
    return this.http.post(this.apiUrl + '-almacen/export-inventario', data, {
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
