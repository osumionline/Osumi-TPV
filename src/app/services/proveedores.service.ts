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

	findById(id: number): Proveedor {
		const ind = this.proveedores.findIndex(x => x.id === id);
		if (ind !== -1) {
			return this.proveedores[ind];
		}
		return null;
	}
}
