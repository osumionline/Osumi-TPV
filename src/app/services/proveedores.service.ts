import { HttpClient } from "@angular/common/http";
import { Injectable, WritableSignal, signal } from "@angular/core";
import { environment } from "@env/environment";
import { IdSaveResult, StatusResult } from "@interfaces/interfaces";
import {
  ComercialInterface,
  ProveedorInterface,
  ProveedoresResult,
} from "@interfaces/proveedor.interface";
import { Proveedor } from "@model/proveedores/proveedor.model";
import { ClassMapperService } from "@services/class-mapper.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProveedoresService {
  proveedores: WritableSignal<Proveedor[]> = signal<Proveedor[]>([]);
  loaded: boolean = false;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve("ok");
      } else {
        this.getProveedores().subscribe((result: ProveedoresResult): void => {
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
    this.proveedores.set(proveedores);
    this.loaded = true;
  }

  resetProveedores(): void {
    this.loaded = false;
    this.load();
  }

  findById(id: number): Proveedor {
    const ind: number = this.proveedores().findIndex(
      (x: Proveedor): boolean => x.id === id
    );
    if (ind !== -1) {
      return this.proveedores()[ind];
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
