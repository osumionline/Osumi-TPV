import { CodigoBarras } from 'src/app/model/codigobarras.model';
import { Utils }        from 'src/app/model/utils.class';
import { Foto }         from 'src/app/model/foto.model';
import {
	ArticuloInterface,
	CodigoBarrasInterface,
	FotoInterface
} from 'src/app/interfaces/interfaces';

export class Articulo {
	marca: string = '';
	proveedor: string = '';
	fotosList: Foto[] = [];

	constructor(
		public id: number = null,
		public localizador: number = null,
		public nombre: string = 'Nuevo artículo',
		public idCategoria: number = null,
		public idMarca: number = null,
		public idProveedor: number = null,
		public referencia: string = '',
		public palb: number = 0,
		public puc: number = 0,
		public pvp: number = 0,
		public iva: number = 0,
		public re: number = 0,
		public margen: number = 0,
		public stock: number = 0,
		public stockMin: number = 0,
		public stockMax: number = 0,
		public loteOptimo: number = 0,
		public ventaOnline: boolean = false,
		public fechaCaducidad: string = null,
		public mostrarEnWeb: boolean = false,
		public descCorta: string  = '',
		public descripcion: string = '',
		public observaciones: string = '',
		public mostrarObsPedidos: boolean = false,
		public mostrarObsVentas: boolean = false,
		public codigosBarras: CodigoBarras[] = [],
		public fotos: number[] = []
	) {}

	fromInterface(a: ArticuloInterface, codBarras: CodigoBarras[]): Articulo {
		this.id = a.id;
		this.localizador = a.localizador;
		this.nombre = Utils.urldecode(a.nombre);
		this.idCategoria = a.idCategoria;
		this.idMarca = a.idMarca;
		this.idProveedor = a.idProveedor;
		this.referencia = a.referencia;
		this.puc = a.puc;
		this.pvp = a.pvp;
		this.palb = a.palb;
		this.iva = a.iva;
		this.re = a.re;
		this.margen = a.margen;
		this.stock = a.stock;
		this.stockMin = a.stockMin;
		this.stockMax = a.stockMax;
		this.loteOptimo = a.loteOptimo;
		this.ventaOnline = a.ventaOnline;
		this.fechaCaducidad = a.fechaCaducidad;
		this.observaciones = Utils.urldecode(a.observaciones);
		this.mostrarObsPedidos = a.mostrarObsPedidos;
		this.mostrarObsVentas = a.mostrarObsVentas;
		this.mostrarEnWeb = a.mostrarEnWeb;
		this.descCorta = Utils.urldecode(a.descCorta);
		this.descripcion = Utils.urldecode(a.descripcion);
		this.codigosBarras = codBarras;
		this.fotos = a.fotos;

		for (let n of this.fotos) {
			this.fotosList.push(new Foto(n));
		}

		return this;
	}

	toInterface(): ArticuloInterface {
		const codBarras: CodigoBarrasInterface[] = [];
		for (let cb of this.codigosBarras) {
			codBarras.push(cb.toInterface());
		}

		const fotos: FotoInterface[] = [];
		for (let foto of this.fotosList) {
			fotos.push(foto.toInterface());
		}

		return {
			id: this.id,
			localizador: this.localizador,
			nombre: Utils.urlencode(this.nombre),
			idCategoria: this.idCategoria,
			idMarca: this.idMarca,
			idProveedor: this.idProveedor,
			referencia: this.referencia,
			puc: this.puc,
			pvp: this.pvp,
			palb: this.palb,
			iva: this.iva,
			re: this.re,
			margen: this.margen,
			stock: this.stock,
			stockMin: this.stockMin,
			stockMax: this.stockMax,
			loteOptimo: this.loteOptimo,
			ventaOnline: this.ventaOnline,
			fechaCaducidad: this.fechaCaducidad,
			observaciones: Utils.urlencode(this.observaciones),
			mostrarObsPedidos: this.mostrarObsPedidos,
			mostrarObsVentas: this.mostrarObsVentas,
			mostrarEnWeb: this.mostrarEnWeb,
			descCorta: Utils.urlencode(this.descCorta),
			descripcion: Utils.urlencode(this.descripcion),
			codigosBarras: codBarras,
			fotos: this.fotos,
			fotosList: fotos
		};
	}
}
