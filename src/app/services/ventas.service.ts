import { Injectable }    from '@angular/core';
import { Venta }         from 'src/app/model/venta.model';
import { LineaVenta }    from 'src/app/model/linea-venta.model';
import { Cliente }       from 'src/app/model/cliente.model';
import { TipoPago }      from 'src/app/model/tipo-pago.model';
import { FinVenta }      from 'src/app/model/fin-venta.model';
import { ConfigService } from 'src/app/services/config.service';
import { Tabs }          from 'src/app/interfaces/interfaces';

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

	constructor(private config: ConfigService) {}

	newVenta(): void {
		this.tabs.names.push('VENTA ' + (this.tabs.names.length + 1));
		this.tabs.selected = (this.tabs.names.length - 1);
		this.list.push(new Venta());

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
		const tipoPago: TipoPago = this.config.tiposPago[0];
		const lineas = this.list[this.tabs.selected].lineas.filter(x => x.idArticulo !== null);

		this.fin = new FinVenta(
			this.list[this.tabs.selected].importe,
			0,
			0,
			tipoPago.id,
			this.cliente ? this.cliente.id : null,
			0,
			lineas
		);
	}
}
