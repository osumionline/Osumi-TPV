import { TipoPagoInterface } from 'src/app/interfaces/interfaces';
import { Utils } from './utils.class';

export class TipoPago {
	constructor(
		public id: number = null,
		public nombre: string = null,
		public slug: string = null,
		public afectaCaja: boolean = null,
		public orden: number = null
	) {}

	fromInterface(tp: TipoPagoInterface): TipoPago {
		this.id = tp.id;
		this.nombre = Utils.urldecode(tp.nombre);
		this.slug = tp.slug;
		this.afectaCaja = tp.afectaCaja;
		this.orden = tp.orden;

		return this;
	}

	toInterface(): TipoPagoInterface {
		return {
			id: this.id,
			nombre: Utils.urlencode(this.nombre),
			slug: this.slug,
			afectaCaja: this.afectaCaja,
			orden: this.orden
		};
	}
}