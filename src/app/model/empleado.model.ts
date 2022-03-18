import { EmpleadoInterface, ColorValues, EmpleadoLoginInterface } from 'src/app/interfaces/interfaces';
import { Utils } from 'src/app/model/utils.class';

export class Empleado {
	pass: string = null;

	constructor(
		public id: number = null,
		public nombre: string = null,
		public color: string = null
	) {}

	get textColor(): string {
		if (!this.color) {
			return '#000';
		}
		const color: ColorValues = Utils.hexToRgbFloat('#'+this.color);
		if (!color) {
			return '#000';
		}
		const o = Math.round(((parseInt(color.r.toString()) * 299) + (parseInt(color.g.toString()) * 587) + (parseInt(color.b.toString()) * 114)) /1000);

		if (o > 125) {
			return '#000';
		}else{
			return '#fff';
		}
	}

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

	toLoginInterface(): EmpleadoLoginInterface {
		return {
			id: this.id,
			pass: Utils.urlencode(this.pass)
		};
	}
}
