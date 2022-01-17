import { LineaVentaInterface } from 'src/app/interfaces/interfaces';

export class LineaVenta {
	constructor(
		public idArticulo: number = null,
		public localizador: number = null,
		public descripcion: string = null,
		public stock: number = null,
		public cantidad: number = null,
		public pvp: number = null,
		public importe: number = null
	) {}

	fromInterface(lv: LineaVentaInterface): LineaVenta {
		this.idArticulo = lv.idArticulo;
		this.localizador = lv.localizador;
		this.descripcion = lv.descripcion;
		this.stock = lv.stock;
		this.cantidad = lv.cantidad;
		this.pvp = lv.pvp;
		this.importe = lv.importe;

		return this;
	}

	toInterface(): LineaVentaInterface {
		return {
			idArticulo: this.idArticulo,
			localizador: this.localizador,
			descripcion: this.descripcion,
			stock: this.stock,
			cantidad: this.cantidad,
			pvp: this.pvp,
			importe: this.importe
		};
	}
}
