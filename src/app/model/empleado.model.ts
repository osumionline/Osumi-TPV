import { EmpleadoInterface } from 'src/app/interfaces/interfaces';
import { Utils } from 'src/app/model/utils.class';

export class Empleado {
	constructor(
		public id: number = null,
		public nombre: string = null,
		public color: string = null
	) {}

	fromInterface(e: EmpleadoInterface): Empleado {
		this.id = e.id;
		this.nombre = Utils.urldecode(e.nombre);
		this.color = e.color;

		return this;
	}

	toInterface(): EmpleadoInterface {
		return {
			id: this.id,
			nombre: Utils.urlencode(this.nombre),
			color: this.color
		};
	}
}
