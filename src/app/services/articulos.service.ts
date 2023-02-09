import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AccesoDirectoResult,
  ArticuloInterface,
  ArticuloResult,
  ArticuloSaveResult,
  ChartResultInterface,
  ChartSelectInterface,
} from "src/app/interfaces/articulo.interface";
import {
  ReturnInfoInterface,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ArticulosService {
  selected: number = -1;
  list: Articulo[] = [];
  returnInfo: ReturnInfoInterface = null;

  constructor(private http: HttpClient) {}

  get articuloActual(): Articulo {
    return this.list[this.selected];
  }

  newArticulo(): void {
    this.selected = this.list.length;
    const articulo: Articulo = new Articulo();
    articulo.tabName = "ARTÍCULO " + (this.list.length + 1);
    this.list.push(articulo);
  }

  getStatistics(data: ChartSelectInterface): Observable<ChartResultInterface> {
    return this.http.post<ChartResultInterface>(
      environment.apiUrl + "-articulos/get-statistics",
      data
    );
  }

  deleteArticulo(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-articulos/delete-articulo",
      { id }
    );
  }

  saveArticulo(articulo: ArticuloInterface): Observable<ArticuloSaveResult> {
    return this.http.post<ArticuloSaveResult>(
      environment.apiUrl + "-articulos/save-articulo",
      articulo
    );
  }

  loadArticulo(localizador: number): Observable<ArticuloResult> {
    return this.http.post<ArticuloResult>(
      environment.apiUrl + "-articulos/load-articulo",
      { localizador }
    );
  }

  getAccesosDirectosList(): Observable<AccesoDirectoResult> {
    return this.http.post<AccesoDirectoResult>(
      environment.apiUrl + "-articulos/get-accesos-directos",
      {}
    );
  }

  asignarAccesoDirecto(
    id: number,
    accesoDirecto: number
  ): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-articulos/asignar-acceso-directo",
      { id, accesoDirecto }
    );
  }

  deleteAccesoDirecto(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-articulos/delete-acceso-directo",
      { id }
    );
  }
}
