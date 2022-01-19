import { ProveedorInterface } from 'src/app/interfaces/interfaces';
import { Utils } from './utils.class';

export class Proveedor {
	constructor(
		public id: number = -1,
		public nombre: string = '',
		public idFoto: number = null,
		public direccion: string = '',
		public telefono: string = '',
		public email: string = '',
		public web: string = '',
		public observaciones: string = '',
		public marcas: number[] = []
	) {}

	fromInterface(p: ProveedorInterface): Proveedor {
		this.id = p.id;
		this.nombre = Utils.urldecode(p.nombre);
		this.idFoto = p.idFoto;
		this.direccion = Utils.urldecode(p.direccion);
		this.telefono = Utils.urldecode(p.telefono);
		this.email = Utils.urldecode(p.email);
		this.web = Utils.urldecode(p.web);
		this.observaciones = Utils.urldecode(p.observaciones);
		this.marcas = p.marcas;

		return this;
	}

	toInterface(): ProveedorInterface {
		return {
			id: this.id,
			nombre: Utils.urlencode(this.nombre),
			idFoto: this.idFoto,
			direccion: Utils.urlencode(this.direccion),
			telefono: Utils.urlencode(this.telefono),
			email: Utils.urlencode(this.email),
			web: Utils.urlencode(this.web),
			observaciones: Utils.urlencode(this.observaciones),
			marcas: this.marcas
		};
	}
}
