import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	ChartSelectInterface,
	ChartResultInterface,
	CategoriasResult,
	StatusResult,
	ArticuloInterface,
	ArticuloSaveResult,
	ArticuloResult,
	SearchArticulosResult
} from 'src/app/interfaces/interfaces'

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
	constructor(private http : HttpClient) {}

	getStatistics(data: ChartSelectInterface): Observable<ChartResultInterface> {
		return this.http.post<ChartResultInterface>(environment.apiUrl + 'getStatistics', data);
	}

	getCategorias(): Observable<CategoriasResult> {
		return this.http.post<CategoriasResult>(environment.apiUrl + 'getCategorias', {});
	}

	deleteArticulo(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(environment.apiUrl + 'deleteArticulo', {id});
	}

	saveArticulo(articulo: ArticuloInterface): Observable<ArticuloSaveResult> {
		return this.http.post<ArticuloSaveResult>(environment.apiUrl + 'saveArticulo', articulo);
	}

	loadArticulo(localizador: number): Observable<ArticuloResult> {
		return this.http.post<ArticuloResult>(environment.apiUrl + 'loadArticulo', {localizador});
	}

	searchArticulos(name: string, idMarca: number): Observable<SearchArticulosResult> {
		return this.http.post<SearchArticulosResult>(environment.apiUrl + 'searchArticulos', {name, idMarca});
	}
}
