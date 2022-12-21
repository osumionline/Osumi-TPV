import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StatusResult } from "src/app/interfaces/interfaces";
import {
  PedidoInterface,
  PedidoResult,
  PedidosAllResult,
  PedidoSaveResult,
  PedidosFilterInterface,
  PedidosResult,
} from "src/app/interfaces/pedido.interface";
import { Pedido } from "src/app/model/pedido.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ComprasService {
  pedidosGuardados: Pedido[] = [];
  guardadosPag: number = 1;
  guardadosPags: number = null;
  pedidosRecepcionados: Pedido[] = [];
  recepcionadosPag: number = 1;
  recepcionadosPags: number = null;
  loaded: boolean = false;

  pedidoTemporal: Pedido = null;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve("ok");
      } else {
        const filters: PedidosFilterInterface = {
          fechaDesde: null,
          fechaHasta: null,
          idProveedor: null,
          albaran: null,
          importeDesde: null,
          importeHasta: null,
          pagina: 1,
        };
        this.getAllPedidos(filters).subscribe(
          (result: PedidosAllResult): void => {
            this.pedidosGuardados = this.cms.getPedidos(result.guardados);
            this.pedidosRecepcionados = this.cms.getPedidos(
              result.recepcionados
            );
            this.guardadosPags = result.guardadosPags;
            this.recepcionadosPags = result.recepcionadosPags;
            resolve("ok");
          }
        );
      }
    });
  }

  getAllPedidos(filters: PedidosFilterInterface): Observable<PedidosAllResult> {
    return this.http.post<PedidosAllResult>(
      environment.apiUrl + "-compras/get-pedidos",
      filters
    );
  }

  resetPedidos(): void {
    this.loaded = false;
    this.load();
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
