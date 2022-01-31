import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
	StartDataInterface,
	AppDataInterface,
	StatusResult,
	MarcasResult,
	MarcaInterface,
	ProveedorInterface,
	ProveedoresResult,
	IdSaveResult,
	CategoriasResult,
	ArticuloInterface,
	ArticuloSaveResult,
	ArticuloResult,
	SearchArticulosResult,
	ChartSelectInterface,
	ChartResultInterface
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient){}

	checkStart(date: string): Observable<StartDataInterface> {
		return this.http.post<StartDataInterface>(this.apiUrl + 'checkStart', {date});
	}

	saveInstallation(data: AppDataInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'saveInstallation', data);
	}

	openBox(): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'openBox', {});
	}

	getMarcas(): Observable<MarcasResult> {
		return this.http.post<MarcasResult>(this.apiUrl + 'getMarcas', {});
	}

	getProveedores(): Observable<ProveedoresResult> {
		return this.http.post<ProveedoresResult>(this.apiUrl + 'getProveedores', {});
	}

	getCategorias(): Observable<CategoriasResult> {
		return this.http.post<CategoriasResult>(this.apiUrl + 'getCategorias', {});
	}

	getStatistics(data: ChartSelectInterface): Observable<ChartResultInterface> {
		return this.http.post<ChartResultInterface>(this.apiUrl + 'getStatistics', data);
	}

	disableProduct(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'disableProduct', {id});
	}

	saveMarca(marca: MarcaInterface): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(this.apiUrl + 'saveMarca', marca);
	}

	saveProveedor(proveedor: ProveedorInterface): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(this.apiUrl + 'saveProveedor', proveedor);
	}

	saveArticulo(articulo: ArticuloInterface): Observable<ArticuloSaveResult> {
		return this.http.post<ArticuloSaveResult>(this.apiUrl + 'saveArticulo', articulo);
	}

	loadArticulo(localizador: number): Observable<ArticuloResult> {
		return this.http.post<ArticuloResult>(this.apiUrl + 'loadArticulo', {localizador});
	}

	searchArticulos(name: string, idMarca: number): Observable<SearchArticulosResult> {
		return this.http.post<SearchArticulosResult>(this.apiUrl + 'searchArticulos', {name, idMarca});
	}
}
