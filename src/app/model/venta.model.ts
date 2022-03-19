import { LineaVenta } from 'src/app/model/linea-venta.model';
import { Cliente }    from 'src/app/model/cliente.model';
import {
	VentaInterface,
	LineaVentaInterface
} from 'src/app/interfaces/interfaces';

export class Venta {
	name: string = '';
	cliente: Cliente = null;
	mostrarEmpleados: boolean = false;

	constructor(
		public id: number = null,
		public idEmpleado: number = null,
		public lineas: LineaVenta[] = [],
		public importe: number = 0
	) {
		if (this.id === null) {
			const d: Date = new Date();
			this.id = d.getTime();
		}
	}

	updateImporte(): void {
		let cant: number = 0;
		for (let i in this.lineas) {
			this.lineas[i].updateImporte();
			cant += this.lineas[i].total;
		}
		this.importe = cant;
	}

	setCliente(c: Cliente): void {
		this.cliente = c;
	}

	fromInterface(v: VentaInterface, lineas: LineaVenta[]): Venta {
		this.idEmpleado = v.idEmpleado;
		this.lineas = lineas;
		this.importe = v.importe;

		return this;
	}

	toInterface(): VentaInterface {
		const lineasVentas: LineaVentaInterface[] = [];
		for (let lv of this.lineas) {
			lineasVentas.push(lv.toInterface());
		}
		return {
			idEmpleado: this.idEmpleado,
			lineas: lineasVentas,
			importe: this.importe
		};
	}
}
