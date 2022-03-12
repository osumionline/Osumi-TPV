import { LineaVenta } from 'src/app/model/linea-venta.model';

export class FinVenta {
	pagoMixto: boolean = false;
	factura: boolean = false;

	constructor(
		public efectivo: string = '0',
		public cambio: string = '0',
		public tarjeta: string = '0',
		public idTipoPago: number =  null,
		public idCliente: number = null,
		public total: string = '0',
		public lineas: LineaVenta[] = []
	) {}
}
