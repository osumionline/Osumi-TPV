import { Injectable }         from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { environment }        from 'src/environments/environment';
import { Cliente }            from 'src/app/model/cliente.model';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import {
	ClientesResult,
	ClienteInterface,
	ClienteSaveResult,
	EstadisticasClienteResult
} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
	clientes: Cliente[] = [];
	loaded: boolean = false;

	constructor(private http : HttpClient, private cms: ClassMapperService) {}

	load(): void {
		if (!this.loaded) {
			this.getClientes().subscribe(result => {
				this.loadClientes( this.cms.getClientes(result.list) );
			});
		}
	}

	getClientes(): Observable<ClientesResult> {
		return this.http.post<ClientesResult>(environment.apiUrl + '-clientes/get-clientes', {});
	}

	loadClientes(clientes: Cliente[]): void {
		this.clientes = clientes;
		this.loaded = true;
	}

	searchClientes(name: string): Observable<ClientesResult> {
		return this.http.post<ClientesResult>(environment.apiUrl + '-clientes/search-clientes', {name});
	}

	saveCliente(cliente: ClienteInterface): Observable<ClienteSaveResult> {
		return this.http.post<ClienteSaveResult>(environment.apiUrl + '-clientes/save-cliente', cliente);
	}

	getEstadisticasCliente(id: number): Observable<EstadisticasClienteResult> {
		return this.http.post<EstadisticasClienteResult>(environment.apiUrl + '-clientes/get-estadisticas-cliente', {id});
	}
}
