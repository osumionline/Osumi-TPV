import { Injectable, WritableSignal, signal } from '@angular/core';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
import {
  ComercialInterface,
  ProveedorInterface,
  ProveedoresResult,
} from '@interfaces/proveedor.interface';
import Proveedor from '@model/proveedores/proveedor.model';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ProveedoresService extends BaseService {
  proveedores: WritableSignal<Proveedor[]> = signal<Proveedor[]>([]);
  loaded: boolean = false;

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve('ok');
      } else {
        this.getProveedores().subscribe((result: ProveedoresResult): void => {
          this.loadProveedores(this.cms.getProveedores(result.list));
          resolve('ok');
        });
      }
    });
  }

  getProveedores(): Observable<ProveedoresResult> {
    return this.http.post<ProveedoresResult>(this.apiUrl + '-proveedores/get-proveedores', {});
  }

  loadProveedores(proveedores: Proveedor[]): void {
    this.proveedores.set(proveedores);
    this.loaded = true;
  }

  resetProveedores(): void {
    this.loaded = false;
    this.load();
  }

  findById(id: number): Proveedor | null {
    const ind: number = this.proveedores().findIndex((x: Proveedor): boolean => x.id === id);
    if (ind !== -1) {
      return this.proveedores()[ind];
    }
    return null;
  }

  saveProveedor(proveedor: ProveedorInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(this.apiUrl + '-proveedores/save-proveedor', proveedor);
  }

  deleteProveedor(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-proveedores/delete-proveedor', {
      id,
    });
  }

  saveComercial(comercial: ComercialInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(this.apiUrl + '-proveedores/save-comercial', comercial);
  }

  deleteComercial(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-proveedores/delete-comercial', {
      id,
    });
  }
}
