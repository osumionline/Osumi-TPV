import { CodigoBarras } from './codigobarras.model';
import { ArticuloInterface, CodigoBarrasInterface } from 'src/app/interfaces/interfaces';
import { Utils } from './utils.class';

export class Articulo {
	constructor(
		public id: number = -1,
		public localizador: number = -1,
		public nombre: string = 'Nuevo artículo',
		public puc: number = 0,
		public pvp: number = 0,
		public margen: number = 0,
		public palb: number = 0,
		public idMarca: number = -1,
		public idProveedor: number = -1,
		public stock: number = 0,
		public stockMin: number = 0,
		public stockMax: number = 0,
		public loteOptimo: number = 0,
		public iva: number = -1,
		public fechaCaducidad: string = '',
		public mostrarFecCad: boolean = false,
		public observaciones: string = '',
		public mostrarObsPedidos: boolean = false,
		public mostrarObsVentas: boolean = false,
		public referencia: string = '',
		public ventaOnline: boolean = false,
		public mostrarEnWeb: boolean = false,
		public idCategoria: number = -1,
		public descCorta: string  = '',
		public desc: string = '',
		public codigosBarras: CodigoBarras[] = [],
		public activo: boolean = true
	) {}

	fromInterface(a: ArticuloInterface, codBarras: CodigoBarras[]): Articulo {
		this.id = a.id;
		this.localizador = a.localizador;
		this.nombre = Utils.urldecode(a.nombre);
		this.puc = a.puc;
		this.pvp = a.pvp;
		this.margen = a.margen;
		this.palb = a.palb;
		this.idMarca = a.idMarca;
		this.idProveedor = a.idProveedor;
		this.stock = a.stock;
		this.stockMin = a.stockMin;
		this.stockMax = a.stockMax;
		this.loteOptimo = a.loteOptimo;
		this.iva = a.iva;
		this.fechaCaducidad = a.fechaCaducidad;
		this.mostrarFecCad = a.mostrarFecCad;
		this.observaciones = Utils.urldecode(a.observaciones);
		this.mostrarObsPedidos = a.mostrarObsPedidos;
		this.mostrarObsVentas = a.mostrarObsVentas;
		this.referencia = a.referencia;
		this.ventaOnline = a.ventaOnline;
		this.mostrarEnWeb = a.mostrarEnWeb;
		this.idCategoria = a.idCategoria;
		this.descCorta = Utils.urldecode(a.descCorta);
		this.desc = Utils.urldecode(a.desc);
		this.codigosBarras = codBarras;
		this.activo = a.activo;

		return this;
	}

	toInterface(): ArticuloInterface {
		const codBarras: CodigoBarrasInterface[] = [];
		for (let cb of this.codigosBarras) {
			codBarras.push(cb.toInterface());
		}

		return {
			id: this.id,
			localizador: this.localizador,
			nombre: Utils.urlencode(this.nombre),
			puc: this.puc,
			pvp: this.pvp,
			margen: this.margen,
			palb: this.palb,
			idMarca: this.idMarca,
			idProveedor: this.idProveedor,
			stock: this.stock,
			stockMin: this.stockMin,
			stockMax: this.stockMax,
			loteOptimo: this.loteOptimo,
			iva: this.iva,
			fechaCaducidad: this.fechaCaducidad,
			mostrarFecCad: this.mostrarFecCad,
			observaciones: Utils.urlencode(this.observaciones),
			mostrarObsPedidos: this.mostrarObsPedidos,
			mostrarObsVentas: this.mostrarObsVentas,
			referencia: this.referencia,
			ventaOnline: this.ventaOnline,
			mostrarEnWeb: this.mostrarEnWeb,
			idCategoria: this.idCategoria,
			descCorta: Utils.urlencode(this.descCorta),
			desc: Utils.urlencode(this.desc),
			codigosBarras: codBarras,
			activo: this.activo
		};
	}
}
