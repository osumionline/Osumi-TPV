import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ClienteInterface,
  ClienteResult,
  ClienteSaveResult,
  ClientesResult,
  EstadisticasClienteResult,
  FacturaResult,
  FacturaSaveInterface,
  FacturasResult,
  ReservasResult,
  VentasClienteResult,
} from "src/app/interfaces/cliente.interface";
import { IdSaveResult, StatusResult } from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/clientes/cliente.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClientesService {
  clientes: Cliente[] = [];
  loaded: boolean = false;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve("ok");
      } else {
        this.getClientes().subscribe((result: ClientesResult): void => {
          this.loadClientes(this.cms.getClientes(result.list));
          resolve("ok");
        });
      }
    });
  }

  getClientes(): Observable<ClientesResult> {
    return this.http.post<ClientesResult>(
      environment.apiUrl + "-clientes/get-clientes",
      {}
    );
  }

  loadClientes(clientes: Cliente[]): void {
    this.clientes = clientes;
    this.loaded = true;
  }

  resetClientes(): void {
    this.loaded = false;
    this.load();
  }

  findById(id: number): Cliente {
    const ind: number = this.clientes.findIndex(
      (x: Cliente): boolean => x.id === id
    );
    if (ind !== -1) {
      return this.clientes[ind];
    }
    return null;
  }

  getCliente(id: number): Observable<ClienteResult> {
    return this.http.post<ClienteResult>(
      environment.apiUrl + "-clientes/get-cliente",
      { id }
    );
  }

  searchClientes(name: string): Observable<ClientesResult> {
    return this.http.post<ClientesResult>(
      environment.apiUrl + "-clientes/search-clientes",
      { name }
    );
  }

  saveCliente(cliente: ClienteInterface): Observable<ClienteSaveResult> {
    return this.http.post<ClienteSaveResult>(
      environment.apiUrl + "-clientes/save-cliente",
      cliente
    );
  }

  getEstadisticasCliente(id: number): Observable<EstadisticasClienteResult> {
    return this.http.post<EstadisticasClienteResult>(
      environment.apiUrl + "-clientes/get-estadisticas-cliente",
      { id }
    );
  }

  deleteCliente(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-clientes/delete-cliente",
      { id }
    );
  }

  asignarCliente(id: number, idCliente: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-clientes/asignar-cliente",
      { id, idCliente }
    );
  }

  getFacturas(id: number): Observable<FacturasResult> {
    return this.http.post<FacturasResult>(
      environment.apiUrl + "-clientes/get-facturas-cliente",
      { id }
    );
  }

  getFactura(id: number): Observable<FacturaResult> {
    return this.http.post<FacturaResult>(
      environment.apiUrl + "-clientes/get-factura-cliente",
      { id }
    );
  }

  getVentas(
    id: number,
    facturadas: string,
    idFacturaInclude: number = null
  ): Observable<VentasClienteResult> {
    return this.http.post<VentasClienteResult>(
      environment.apiUrl + "-clientes/get-ventas-cliente",
      { id, facturadas, idFacturaInclude }
    );
  }

  saveFactura(data: FacturaSaveInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(
      environment.apiUrl + "-clientes/save-factura",
      data
    );
  }

  deleteFactura(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-clientes/delete-factura",
      { id }
    );
  }

  saveFacturaFromVenta(id: number): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(
      environment.apiUrl + "-clientes/save-factura-from-venta",
      { id }
    );
  }

  sendFactura(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-clientes/send-factura",
      { id }
    );
  }

  getReservas(): Observable<ReservasResult> {
    return this.http.post<ReservasResult>(
      environment.apiUrl + "-clientes/get-reservas",
      {}
    );
  }

  deleteReserva(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-clientes/delete-reserva",
      { id }
    );
  }
}
