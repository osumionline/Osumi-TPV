import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ComercialInterface,
  IdSaveResult,
  ProveedoresResult,
  ProveedorInterface,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { Proveedor } from "src/app/model/proveedor.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProveedoresService {
  proveedores: Proveedor[] = [];
  loaded: boolean = false;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve("ok");
      } else {
        this.getProveedores().subscribe((result) => {
          this.loadProveedores(this.cms.getProveedores(result.list));
          resolve("ok");
        });
      }
    });
  }

  getProveedores(): Observable<ProveedoresResult> {
    return this.http.post<ProveedoresResult>(
      environment.apiUrl + "-proveedores/get-proveedores",
      {}
    );
  }

  loadProveedores(proveedores: Proveedor[]): void {
    this.proveedores = proveedores;
    this.loaded = true;
  }

  resetProveedores(): void {
    this.loaded = false;
    this.load();
  }

  findById(id: number): Proveedor {
    const ind = this.proveedores.findIndex((x) => x.id === id);
    if (ind !== -1) {
      return this.proveedores[ind];
    }
    return null;
  }

  saveProveedor(proveedor: ProveedorInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(
      environment.apiUrl + "-proveedores/save-proveedor",
      proveedor
    );
  }

  deleteProveedor(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-proveedores/delete-proveedor",
      { id }
    );
  }

  saveComercial(comercial: ComercialInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(
      environment.apiUrl + "-proveedores/save-comercial",
      comercial
    );
  }

  deleteComercial(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-proveedores/delete-comercial",
      { id }
    );
  }
}
