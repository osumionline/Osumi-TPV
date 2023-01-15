import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
  InventarioItemInterface,
} from "src/app/interfaces/almacen.interface";
import {
  StatusMessageErrorsResult,
  StatusMessageResult,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AlmacenService {
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
  ): Observable<StatusMessageResult> {
    return this.http.post<StatusMessageResult>(
      environment.apiUrl + "-almacen/save-inventario",
      item
    );
  }

  saveAllInventario(
    list: InventarioItemInterface[]
  ): Observable<StatusMessageErrorsResult> {
    return this.http.post<StatusMessageErrorsResult>(
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
}
