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
	Tabs,
	StatusResult
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class VentasService {
	tabs: Tabs = {
		selected: -1,
		names: []
	};
	list: Venta[] = [];
	fin: FinVenta = new FinVenta();

	constructor(private http : HttpClient) {}

	newVenta(empleados: boolean): void {
		this.tabs.names.push('VENTA ' + (this.tabs.names.length + 1));
		this.tabs.selected = (this.tabs.names.length - 1);
		const venta = new Venta();
		if (empleados) {
			venta.mostrarEmpleados = true;
		}
		this.list.push(venta);

		this.addLineaVenta();
	}

	addLineaVenta(): void {
		this.list[this.tabs.selected].lineas.push(new LineaVenta());
	}

	get ventaActual(): Venta {
		return this.list[this.tabs.selected];
	}

	set cliente(c: Cliente) {
		this.list[this.tabs.selected].setCliente(c);
	}

	get cliente(): Cliente {
		return this.list[this.tabs.selected].cliente ? this.list[this.tabs.selected].cliente : null;
	}

	loadFinVenta(): void {
		const lineas = this.list[this.tabs.selected].lineas.filter(x => x.idArticulo !== null);

		this.fin = new FinVenta(
			Utils.formatNumber(this.list[this.tabs.selected].importe),
			'0',
			null,
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
