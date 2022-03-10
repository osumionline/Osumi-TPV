import { LineaVenta } from 'src/app/model/linea-venta.model';

export class FinVenta {
	pagoMixto: boolean = false;
	factura: boolean = false;

	constructor(
		public efectivo: number = 0,
		public cambio: number = 0,
		public tarjeta: number = 0,
		public idTipoPago: number =  null,
		public idCliente: number = null,
		public total: number = 0,
		public lineas: LineaVenta[] = []
	) {}
}
