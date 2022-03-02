import { Injectable }         from '@angular/core';
import { Proveedor }          from 'src/app/model/proveedor.model';
import { ApiService }         from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Injectable({
	providedIn: 'root'
})
export class ProveedoresService {
	proveedores: Proveedor[] = [];
	loaded: boolean = false;

	constructor(private as: ApiService, private cms: ClassMapperService) {}

	load(): void {
		if (!this.loaded) {
			this.as.getProveedores().subscribe(result => {
				this.loadProveedores( this.cms.getProveedores(result.list) );
			});
		}
	}

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
