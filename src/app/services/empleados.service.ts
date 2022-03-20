import { Injectable } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { Empleado }           from 'src/app/model/empleado.model';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { environment }        from 'src/environments/environment';
import {
	EmpleadosResult,
	EmpleadoInterface,
	EmpleadoLoginInterface,
	IdSaveResult,
	StatusResult
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EmpleadosService {
	empleados: Empleado[] = [];
	loaded: boolean = false;

	constructor(private http : HttpClient, private cms: ClassMapperService) {}

	load(): Promise<string> {
		return new Promise((resolve) => {
			if (this.loaded) {
				resolve('ok');
			}
			else {
				this.getEmpleados().subscribe(result => {
					this.loadEmpleados( this.cms.getEmpleados(result.list) );
					resolve('ok');
				});
			}
		});
	}

	getEmpleados(): Observable<EmpleadosResult> {
		return this.http.post<EmpleadosResult>(environment.apiUrl + '-empleados/get-empleados', {});
	}

	loadEmpleados(empleados: Empleado[]): void {
		this.empleados = empleados;
		this.loaded = true;
	}

	saveEmpleado(empleado: EmpleadoInterface): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(environment.apiUrl + '-empleados/save-empleado', empleado);
	}

	login(empleado: EmpleadoLoginInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(environment.apiUrl + '-empleados/login', empleado);
	}
}
