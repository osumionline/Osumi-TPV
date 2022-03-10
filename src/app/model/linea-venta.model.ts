import { Articulo }            from 'src/app/model/articulo.model';
import { LineaVentaInterface } from 'src/app/interfaces/interfaces';

export class LineaVenta {
	importeManual: boolean = false;
	descuentoManual: boolean = false;

	constructor(
		public idArticulo: number = null,
		public localizador: number = null,
		public descripcion: string = null,
		public marca: string = null,
		public stock: number = null,
		public cantidad: number = null,
		public pvp: number = null,
		public importe: number = null,
		public descuento: number = null,
		public observaciones: string = null
	) {}

	get total(): number {
		if (this.importeManual) {
			return this.importe;
		}
		if (this.descuentoManual) {
			return ( (this.cantidad * this.pvp) - (this.descuento) );
		}
		return ( (this.cantidad * this.pvp) * (1 - (this.descuento / 100) ) );
	}

	fromArticulo(a: Articulo): LineaVenta {
		this.idArticulo = a.id;
		this.localizador = a.localizador;
		this.descripcion = a.nombre;
        this.marca = a.marca;
		this.stock = a.stock;
		this.cantidad = 1;
		this.pvp = a.pvp;
		this.importe = a.pvp;
		this.descuento = 0;
		this.observaciones = (a.mostrarObsVentas) ? a.observaciones : null;

		return this;
	}

	fromInterface(lv: LineaVentaInterface): LineaVenta {
		this.idArticulo = lv.idArticulo;
		this.localizador = lv.localizador;
		this.descripcion = lv.descripcion;
        this.marca = lv.marca;
		this.stock = lv.stock;
		this.cantidad = lv.cantidad;
		this.pvp = lv.pvp;
		this.importe = lv.importe;
		this.descuento = lv.descuento;
		this.observaciones = lv.observaciones;

		return this;
	}

	toInterface(): LineaVentaInterface {
		return {
			idArticulo: this.idArticulo,
			localizador: this.localizador,
			descripcion: this.descripcion,
            marca: this.marca,
			stock: this.stock,
			cantidad: this.cantidad,
			pvp: this.pvp,
			importe: this.importe,
			descuento: this.descuento,
			observaciones: this.observaciones
		};
	}
}