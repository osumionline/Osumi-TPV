import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
	StartDataResult,
	AppData,
	StatusResult,
	Marca,
	MarcasResult,
	Proveedor,
	ProveedoresResult,
	IdSaveResult,
	CategoriasResult,
	Articulo,
	ArticuloSaveResult,
	ArticuloResult
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient){}

	checkStart(date: string): Observable<StartDataResult> {
		return this.http.post<StartDataResult>(this.apiUrl + 'checkStart', {date});
	}

	saveInstallation(data: AppData): Observable<StatusResult> {
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

	disableProduct(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'disableProduct', {id});
	}

	saveMarca(marca: Marca): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(this.apiUrl + 'saveMarca', marca);
	}

	saveProveedor(proveedor: Proveedor): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(this.apiUrl + 'saveProveedor', proveedor);
	}

	saveArticulo(articulo: Articulo): Observable<ArticuloSaveResult> {
		return this.http.post<ArticuloSaveResult>(this.apiUrl + 'saveArticulo', articulo);
	}

	loadArticulo(localizador: number): Observable<ArticuloResult> {
		return this.http.post<ArticuloResult>(this.apiUrl + 'loadArticulo', {localizador});
	}
}
