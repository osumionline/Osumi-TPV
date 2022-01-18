import { LineaVenta } from './lineaventa.model';
import { VentaInterface, LineaVentaInterface } from 'src/app/interfaces/interfaces';

export class Venta {
	constructor(
		public id: number = null,
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
			cant += this.lineas[i].total;
		}
		this.importe = cant;
	}

	fromInterface(v: VentaInterface, lineas: LineaVenta[]): Venta {
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
			lineas: lineasVentas,
			importe: this.importe
		};
	}
}
