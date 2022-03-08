import { Utils }            from 'src/app/model/utils.class';
import {
	ClienteInterface,
	UltimaVentaArticuloInterface,
	TopVentaInterface
} from 'src/app/interfaces/interfaces';

export class Cliente {
	ultimasVentas: UltimaVentaArticuloInterface[] = [];
	topVentas: TopVentaInterface[] = [];

	constructor(
		public id: number = null,
		public nombreApellidos: string = null,
		public dniCif: string = null,
		public telefono: string = null,
		public email: string = null,
		public direccion: string = null,
		public codigoPostal: string = null,
		public poblacion: string = null,
		public provincia: number = null,
		public factIgual: boolean = true,
		public factNombreApellidos: string = null,
		public factDniCif: string = null,
		public factTelefono: string = null,
		public factEmail: string = null,
		public factDireccion: string = null,
		public factCodigoPostal: string = null,
		public factPoblacion: string = null,
		public factProvincia: number = null,
		public observaciones: string = null,
		public ultimaVenta: string = null
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
		this.factProvincia = c.factProvincia;
		this.observaciones = Utils.urldecode(c.observaciones);
		this.ultimaVenta = Utils.urldecode(c.ultimaVenta);

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
			factProvincia: this.factProvincia,
			observaciones: Utils.urlencode(this.observaciones),
			ultimaVenta: Utils.urlencode(this.ultimaVenta)
		};
	}
}
