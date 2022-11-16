import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ClienteInterface,
  ClienteSaveResult,
  ClientesResult,
  EstadisticasClienteResult,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/cliente.model";
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
        this.getClientes().subscribe((result) => {
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
}
