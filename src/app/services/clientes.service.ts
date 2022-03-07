import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	SearchClientesResult,
	ClienteInterface,
	ClienteSaveResult,
	EstadisticasClienteResult
} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
	constructor(private http : HttpClient) {}

	searchClientes(name: string): Observable<SearchClientesResult> {
		return this.http.post<SearchClientesResult>(environment.apiUrl + 'searchClientes', {name});
	}

	saveCliente(cliente: ClienteInterface): Observable<ClienteSaveResult> {
		return this.http.post<ClienteSaveResult>(environment.apiUrl + 'saveCliente', cliente);
	}

	getEstadisticasCliente(id: number): Observable<EstadisticasClienteResult> {
		return this.http.post<EstadisticasClienteResult>(environment.apiUrl + 'getEstadisticasCliente', {id});
	}
}
