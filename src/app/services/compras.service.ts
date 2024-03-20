import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { StatusResult } from "@interfaces/interfaces";
import {
  PedidoInterface,
  PedidoResult,
  PedidosAllResult,
  PedidoSaveResult,
  PedidosFilterInterface,
  PedidosResult,
} from "@interfaces/pedido.interface";
import { Pedido } from "@model/compras/pedido.model";
import { ClassMapperService } from "@services/class-mapper.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ComprasService {
  pedidoTemporal: Pedido = null;
  pedidoCargado: number = null;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  getAllPedidos(filters: PedidosFilterInterface): Observable<PedidosAllResult> {
    return this.http.post<PedidosAllResult>(
      environment.apiUrl + "-compras/get-pedidos",
      filters
    );
  }

  getPedidosGuardados(
    filters: PedidosFilterInterface
  ): Observable<PedidosResult> {
    return this.http.post<PedidosResult>(
      environment.apiUrl + "-compras/get-pedidos-guardados",
      filters
    );
  }

  getPedidosRecepcionados(
    filters: PedidosFilterInterface
  ): Observable<PedidosResult> {
    return this.http.post<PedidosResult>(
      environment.apiUrl + "-compras/get-pedidos-recepcionados",
      filters
    );
  }

  getPedido(id: number): Observable<PedidoResult> {
    return this.http.post<PedidoResult>(
      environment.apiUrl + "-compras/get-pedido",
      { id }
    );
  }

  savePedido(pedido: PedidoInterface): Observable<PedidoSaveResult> {
    return this.http.post<PedidoSaveResult>(
      environment.apiUrl + "-compras/save-pedido",
      pedido
    );
  }

  autoSavePedido(pedido: PedidoInterface): Observable<PedidoSaveResult> {
    return this.http.post<PedidoSaveResult>(
      environment.apiUrl + "-compras/auto-save-pedido",
      pedido
    );
  }

  setPedidoTemporal(pedido: Pedido): void {
    this.pedidoTemporal = pedido;
  }

  clearPedidoTemporal(): void {
    this.pedidoTemporal = null;
  }

  deletePedido(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-compras/delete-pedido",
      { id }
    );
  }
}
