import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable }    from 'rxjs';
import { environment }   from 'src/environments/environment';
import { Venta }         from 'src/app/model/venta.model';
import { LineaVenta }    from 'src/app/model/linea-venta.model';
import { Cliente }       from 'src/app/model/cliente.model';
import { FinVenta }      from 'src/app/model/fin-venta.model';
import { Utils }         from 'src/app/model/utils.class';
import {
	StatusResult
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class VentasService {
	selected: number = -1;
	list: Venta[] = [];
	fin: FinVenta = new FinVenta();

	constructor(private http : HttpClient) {}

	newVenta(empleados: boolean, idEmpleadoDef: number): void {
		this.selected = this.list.length;
		const venta = new Venta();
		venta.name = 'VENTA ' + (this.list.length + 1);
		venta.mostrarEmpleados = empleados;
		this.list.push(venta);

		if (!empleados) {
			this.ventaActual.idEmpleado = idEmpleadoDef;
			this.addLineaVenta();
		}
	}

	addLineaVenta(): void {
		this.ventaActual.lineas.push(new LineaVenta());
	}

	get ventaActual(): Venta {
		return this.list[this.selected];
	}

	set cliente(c: Cliente) {
		this.ventaActual.setCliente(c);
	}

	get cliente(): Cliente {
		return this.ventaActual ?
				(this.ventaActual.cliente ? this.ventaActual.cliente : null)
				: null;
	}

	loadFinVenta(): void {
		const lineas = this.ventaActual.lineas.filter(x => x.idArticulo !== null);

		this.fin = new FinVenta(
			Utils.formatNumber(this.ventaActual.importe),
			'0',
			null,
			this.ventaActual.idEmpleado,
			null,
			this.cliente ? this.cliente.id : -1,
			Utils.formatNumber(this.ventaActual.importe),
			lineas
		);
	}

	guardarVenta(): Observable<StatusResult> {
		return this.http.post<StatusResult>(environment.apiUrl + '-ventas/save-venta', this.fin.toInterface());
	}
}
