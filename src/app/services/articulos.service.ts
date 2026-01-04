import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  AccesoDirectoResult,
  ArticuloInterface,
  ArticuloResult,
  ArticuloSaveResult,
  ChartResultInterface,
  ChartSelectInterface,
  HistoricoArticuloBuscadorInterface,
  HistoricoArticuloResult,
} from '@interfaces/articulo.interface';
import { ReturnInfoInterface, StatusResult } from '@interfaces/interfaces';
import Articulo from '@model/articulos/articulo.model';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ArticulosService extends BaseService {
  selected: WritableSignal<number> = signal<number>(-1);
  list: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  returnInfo: ReturnInfoInterface | null = null;

  get articuloActual(): Articulo {
    return this.list()[this.selected()];
  }

  createNewArticulo(localizador: number | null = null): Articulo {
    const articulo: Articulo = new Articulo();
    articulo.tabName = 'ARTÍCULO';
    articulo.localizador = localizador;
    if (localizador !== null) {
      articulo.status = 'load';
    }
    return articulo;
  }

  addArticuloToList(articulo: Articulo): void {
    this.list.update((value: Articulo[]): Articulo[] => {
      value.push(articulo);
      return value;
    });
  }

  newArticulo(localizador: number | null = null): void {
    const articulo: Articulo = this.createNewArticulo(localizador);
    this.addArticuloToList(articulo);
    this.selected.set(this.list().length - 1);
  }

  closeArticulo(ind: number): void {
    this.list.update((value: Articulo[]): Articulo[] => {
      value.splice(ind, 1);
      return value;
    });
  }

  updateArticulos(articulos: Articulo[]): void {
    this.list.set(articulos);
  }

  updateSelected(ind: number): void {
    this.selected.set(ind);
  }

  getStatistics(data: ChartSelectInterface): Observable<ChartResultInterface> {
    return this.http.post<ChartResultInterface>(this.apiUrl + '-articulos/get-statistics', data);
  }

  getHistoricoArticulo(
    data: HistoricoArticuloBuscadorInterface
  ): Observable<HistoricoArticuloResult> {
    return this.http.post<HistoricoArticuloResult>(
      this.apiUrl + '-articulos/get-historico-articulo',
      data
    );
  }

  deleteArticulo(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-articulos/delete-articulo', { id });
  }

  saveArticulo(articulo: ArticuloInterface): Observable<ArticuloSaveResult> {
    return this.http.post<ArticuloSaveResult>(this.apiUrl + '-articulos/save-articulo', articulo);
  }

  loadArticulo(localizador: number): Observable<ArticuloResult> {
    return this.http.post<ArticuloResult>(this.apiUrl + '-articulos/load-articulo', {
      localizador,
    });
  }

  getAccesosDirectosList(): Observable<AccesoDirectoResult> {
    return this.http.post<AccesoDirectoResult>(this.apiUrl + '-articulos/get-accesos-directos', {});
  }

  asignarAccesoDirecto(id: number, accesoDirecto: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-articulos/asignar-acceso-directo', {
      id,
      accesoDirecto,
    });
  }

  deleteAccesoDirecto(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-articulos/delete-acceso-directo', {
      id,
    });
  }
}
