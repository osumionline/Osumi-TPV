import { ClienteInterface } from 'src/app/interfaces/interfaces';

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
		this.nombreApellidos = c.nombreApellidos;
		this.dniCif = c.dniCif;
		this.telefono = c.telefono;
		this.email = c.email;
		this.direccion = c.direccion;
		this.codigoPostal = c.codigoPostal;
		this.poblacion = c.poblacion;
		this.provincia = c.provincia;
		this.factIgual = c.factIgual;
		this.factNombreApellidos = c.factNombreApellidos;
		this.factDniCif = c.factDniCif;
		this.factTelefono = c.factTelefono;
		this.factEmail = c.factEmail;
		this.factDireccion = c.factDireccion;
		this.factCodigoPostal = c.factCodigoPostal;
		this.factPoblacion = c.factPoblacion;
		this.factProvincia = c.factProvincia;
		this.observaciones = c.observaciones;

		return this;
	}

	toInterface(): ClienteInterface {
		return {
			id: this.id,
			nombreApellidos: this.nombreApellidos,
			dniCif: this.dniCif,
			telefono: this.telefono,
			email: this.email,
			direccion: this.direccion,
			codigoPostal: this.codigoPostal,
			poblacion: this.poblacion,
			provincia: this.provincia,
			factIgual: this.factIgual,
			factNombreApellidos: this.factNombreApellidos,
			factDniCif: this.factDniCif,
			factTelefono: this.factTelefono,
			factEmail: this.factEmail,
			factDireccion: this.factDireccion,
			factCodigoPostal: this.factCodigoPostal,
			factPoblacion: this.factPoblacion,
			factProvincia: this.factProvincia,
			observaciones: this.observaciones
		};
	}
}