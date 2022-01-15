import { Injectable } from '@angular/core';
import { Proveedor }  from 'src/app/model/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  proveedores: Proveedor[] = [];
  loaded: boolean = false;

  constructor() {}

  loadProveedores(proveedores: Proveedor[]): void {
    this.proveedores = proveedores;
    this.loaded = true;
  }
}
