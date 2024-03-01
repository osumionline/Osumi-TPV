import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
  InventarioItemInterface,
} from "src/app/interfaces/almacen.interface";
import {
  StatusIdMessageErrorsResult,
  StatusIdMessageResult,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { InventarioItem } from "src/app/model/almacen/inventario-item.model";
import { environment } from "src/environments/environment";
import { Articulo } from "../model/articulos/articulo.model";

@Injectable({
  providedIn: "root",
})
export class AlmacenService {
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

  constructor(private http: HttpClient) {}

  getInventario(
    data: BuscadorAlmacenInterface
  ): Observable<BuscadorAlmacenResult> {
    return this.http.post<BuscadorAlmacenResult>(
      environment.apiUrl + "-almacen/get-inventario",
      data
    );
  }

  saveInventario(
    item: InventarioItemInterface
  ): Observable<StatusIdMessageResult> {
    return this.http.post<StatusIdMessageResult>(
      environment.apiUrl + "-almacen/save-inventario",
      item
    );
  }

  saveAllInventario(
    list: InventarioItemInterface[]
  ): Observable<StatusIdMessageErrorsResult> {
    return this.http.post<StatusIdMessageErrorsResult>(
      environment.apiUrl + "-almacen/save-all-inventario",
      { list }
    );
  }

  deleteInventario(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-almacen/delete-inventario",
      { id }
    );
  }

  exportInventario(data: BuscadorAlmacenInterface): Observable<any> {
    return this.http.post(
      environment.apiUrl + "-almacen/export-inventario",
      data,
      {
        responseType: "text",
      }
    );
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
