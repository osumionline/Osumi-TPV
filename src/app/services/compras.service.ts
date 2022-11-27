import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  PedidosAllResult,
  PedidosFilterInterface,
} from "src/app/interfaces/interfaces";
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
        this.getAllPedidos(filters).subscribe((result) => {
          this.pedidosGuardados = this.cms.getPedidos(result.guardados);
          this.pedidosRecepcionados = this.cms.getPedidos(result.recepcionados);
          this.guardadosPags = result.guardadosPags;
          this.recepcionadosPags = result.recepcionadosPags;
          resolve("ok");
        });
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
}