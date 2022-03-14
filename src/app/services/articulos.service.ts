import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	ChartSelectInterface,
	ChartResultInterface,
	StatusResult,
	ArticuloInterface,
	ArticuloSaveResult,
	ArticuloResult,
	SearchArticulosResult
} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
	constructor(private http : HttpClient) {}

	getStatistics(data: ChartSelectInterface): Observable<ChartResultInterface> {
		return this.http.post<ChartResultInterface>(environment.apiUrl + '-articulos/get-statistics', data);
	}

	deleteArticulo(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(environment.apiUrl + '-articulos/delete-articulo', {id});
	}

	saveArticulo(articulo: ArticuloInterface): Observable<ArticuloSaveResult> {
		return this.http.post<ArticuloSaveResult>(environment.apiUrl + '-articulos/save-articulo', articulo);
	}

	loadArticulo(localizador: number): Observable<ArticuloResult> {
		return this.http.post<ArticuloResult>(environment.apiUrl + '-articulos/load-articulo', {localizador});
	}

	searchArticulos(name: string, idMarca: number): Observable<SearchArticulosResult> {
		return this.http.post<SearchArticulosResult>(environment.apiUrl + '-articulos/search-articulos', {name, idMarca});
	}
}
