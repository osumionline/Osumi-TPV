import { Injectable }         from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { Proveedor }          from 'src/app/model/proveedor.model';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { environment }        from 'src/environments/environment';
import {
	ProveedoresResult,
	ProveedorInterface,
	IdSaveResult
}  from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProveedoresService {
	proveedores: Proveedor[] = [];
	loaded: boolean = false;

	constructor(private http : HttpClient, private cms: ClassMapperService) {}

	load(): Promise<string> {
		return new Promise((resolve) => {
			if (this.loaded) {
				resolve('ok');
			}
			else {
				this.getProveedores().subscribe(result => {
					this.loadProveedores( this.cms.getProveedores(result.list) );
					resolve('ok');
				});
			}
		});
	}

	getProveedores(): Observable<ProveedoresResult> {
		return this.http.post<ProveedoresResult>(environment.apiUrl + '-proveedores/get-proveedores', {});
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

	saveProveedor(proveedor: ProveedorInterface): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(environment.apiUrl + '-proveedores/save-proveedor', proveedor);
	}
}
