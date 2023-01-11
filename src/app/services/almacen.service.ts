import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
} from "src/app/interfaces/almacen.interface";
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
}
