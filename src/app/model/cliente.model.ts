import { ClienteInterface } from 'src/app/interfaces/interfaces';
import { Utils } from './utils.class';

export class Cliente {
	constructor(
		public id: number = null,
		public nombreApellidos = null,
		public dniCif = null,
		public telefono = null,
		public email = null,
		public direccion = null,
		public codigoPostal = null,
		public poblacion = null,
		public provincia = null,
		public factIgual = true,
		public factNombreApellidos = null,
		public factDniCif = null,
		public factTelefono = null,
		public factEmail = null,
		public factDireccion = null,
		public factCodigoPostal = null,
		public factPoblacion = null,
		public factProvincia = null,
		public observaciones = null
	) {}

	fromInterface(c: ClienteInterface): Cliente {
		this.id = c.id;
		this.nombreApellidos = Utils.urldecode(c.nombreApellidos);
		this.dniCif = Utils.urldecode(c.dniCif);
		this.telefono = Utils.urldecode(c.telefono);
		this.email = Utils.urldecode(c.email);
		this.direccion = Utils.urldecode(c.direccion);
		this.codigoPostal = Utils.urldecode(c.codigoPostal);
		this.poblacion = Utils.urldecode(c.poblacion);
		this.provincia = c.provincia;
		this.factIgual = c.factIgual;
		this.factNombreApellidos = Utils.urldecode(c.factNombreApellidos);
		this.factDniCif = Utils.urldecode(c.factDniCif);
		this.factTelefono = Utils.urldecode(c.factTelefono);
		this.factEmail = Utils.urldecode(c.factEmail);
		this.factDireccion = Utils.urldecode(c.factDireccion);
		this.factCodigoPostal = Utils.urldecode(c.factCodigoPostal);
		this.factPoblacion = Utils.urldecode(c.factPoblacion);
		this.factProvincia = Utils.urldecode(c.factProvincia);
		this.observaciones = Utils.urldecode(c.observaciones);

		return this;
	}

	toInterface(): ClienteInterface {
		return {
			id: this.id,
			nombreApellidos: Utils.urlencode(this.nombreApellidos),
			dniCif: Utils.urlencode(this.dniCif),
			telefono: Utils.urlencode(this.telefono),
			email: Utils.urlencode(this.email),
			direccion: Utils.urlencode(this.direccion),
			codigoPostal: Utils.urlencode(this.codigoPostal),
			poblacion: Utils.urlencode(this.poblacion),
			provincia: this.provincia,
			factIgual: this.factIgual,
			factNombreApellidos: Utils.urlencode(this.factNombreApellidos),
			factDniCif: Utils.urlencode(this.factDniCif),
			factTelefono: Utils.urlencode(this.factTelefono),
			factEmail: Utils.urlencode(this.factEmail),
			factDireccion: Utils.urlencode(this.factDireccion),
			factCodigoPostal: Utils.urlencode(this.factCodigoPostal),
			factPoblacion: Utils.urlencode(this.factPoblacion),
			factProvincia: Utils.urlencode(this.factProvincia),
			observaciones: Utils.urlencode(this.observaciones)
		};
	}
}