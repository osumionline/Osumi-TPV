import { TarjetaInterface } from 'src/app/interfaces/interfaces';
import { Utils } from './utils.class';

export class Tarjeta {
	constructor(
		public id: number = null,
		public nombre: string = null,
		public slug: string = null,
		public comision: number = null,
		public porDefecto: boolean = false
	) {}

	fromInterface(t: TarjetaInterface): Tarjeta {
		this.id = t.id;
		this.nombre = Utils.urldecode(t.nombre);
		this.slug = t.slug;
		this.comision = t.comision;
		this.porDefecto = t.porDefecto;

		return this;
	}

	toInterface(): TarjetaInterface {
		return {
			id: this.id,
			nombre: Utils.urlencode(this.nombre),
			slug: this.slug,
			comision: this.comision,
			porDefecto: this.porDefecto
		};
	}
}