import { Injectable } from '@angular/core';
import { StatusResult } from '@interfaces/interfaces';
import {
  PedidoInterface,
  PedidoResult,
  PedidosAllResult,
  PedidoSaveResult,
  PedidosFilterInterface,
  PedidosResult,
} from '@interfaces/pedido.interface';
import Pedido from '@model/compras/pedido.model';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ComprasService extends BaseService {
  pedidoTemporal: Pedido | null = null;
  pedidoCargado: number | null = null;

  getAllPedidos(filters: PedidosFilterInterface): Observable<PedidosAllResult> {
    return this.http.post<PedidosAllResult>(this.apiUrl + '-compras/get-pedidos', filters);
  }

  getPedidosGuardados(filters: PedidosFilterInterface): Observable<PedidosResult> {
    return this.http.post<PedidosResult>(this.apiUrl + '-compras/get-pedidos-guardados', filters);
  }

  getPedidosRecepcionados(filters: PedidosFilterInterface): Observable<PedidosResult> {
    return this.http.post<PedidosResult>(
      this.apiUrl + '-compras/get-pedidos-recepcionados',
      filters
    );
  }

  getPedido(id: number): Observable<PedidoResult> {
    return this.http.post<PedidoResult>(this.apiUrl + '-compras/get-pedido', { id });
  }

  savePedido(pedido: PedidoInterface): Observable<PedidoSaveResult> {
    return this.http.post<PedidoSaveResult>(this.apiUrl + '-compras/save-pedido', pedido);
  }

  autoSavePedido(pedido: PedidoInterface): Observable<PedidoSaveResult> {
    return this.http.post<PedidoSaveResult>(this.apiUrl + '-compras/auto-save-pedido', pedido);
  }

  setPedidoTemporal(pedido: Pedido): void {
    this.pedidoTemporal = pedido;
  }

  clearPedidoTemporal(): void {
    this.pedidoTemporal = null;
  }

  deletePedido(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-compras/delete-pedido', { id });
  }
}
