import { Injectable }   from '@angular/core';
import { Marca }        from 'src/app/model/marca.model';
import { Proveedor }    from 'src/app/model/proveedor.model';
import { Categoria }    from 'src/app/model/categoria.model';
import { Articulo }     from 'src/app/model/articulo.model';
import { CodigoBarras } from 'src/app/model/codigobarras.model';
import { TipoPago }     from 'src/app/model/tipo-pago.model';
import { MarcaInterface, ProveedorInterface, CategoriaInterface, ArticuloInterface, CodigoBarrasInterface, TipoPagoInterface } from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor() {}

	getMarca(m: MarcaInterface): Marca {
		return new Marca().fromInterface(m);
	}

	getMarcas(ms: MarcaInterface[]): Marca[] {
		const marcas: Marca[] = [];

		for (let m of ms) {
			marcas.push(this.getMarca(m));
		}

		return marcas;
	}

	getProveedor(p: ProveedorInterface): Proveedor {
		return new Proveedor().fromInterface(p);
	}

	getProveedores(ps: ProveedorInterface[]): Proveedor[] {
		const proveedores: Proveedor[] = [];

		for (let p of ps) {
			proveedores.push(this.getProveedor(p));
		}

		return proveedores;
	}

	getCategoria(c: CategoriaInterface): Categoria {
		const hijos: Categoria[] = [];
		for (let h of c.hijos) {
			hijos.push(this.getCategoria(h));
		}
		return new Categoria().fromInterface(c, hijos);
	}

	getCategorias(cs: CategoriaInterface[]): Categoria[] {
		const categorias: Categoria[] = [];

		for (let c of cs) {
			categorias.push(this.getCategoria(c));
		}

		return categorias;
	}

	getCodigoBarras(cb: CodigoBarrasInterface): CodigoBarras {
		return new CodigoBarras().fromInterface(cb);
	}

	getCodigosBarras(cbs: CodigoBarrasInterface[]): CodigoBarras[] {
		const codigosBarras: CodigoBarras[] = [];

		for (let cb of cbs) {
			codigosBarras.push(this.getCodigoBarras(cb));
		}

		return codigosBarras;
	}

	getArticulo(a: ArticuloInterface): Articulo {
		return new Articulo().fromInterface(a, this.getCodigosBarras(a.codigosBarras));
	}

	getArticulos(as: ArticuloInterface[]): Articulo[] {
		const articulos: Articulo[] = [];

		for (let a of as) {
			articulos.push(this.getArticulo(a));
		}

		return articulos;
	}

	getTipoPago(tp: TipoPagoInterface): TipoPago {
		return new TipoPago().fromInterface(tp);
	}

	getTiposPago(tps: TipoPagoInterface[]): TipoPago[] {
		const tiposPago: TipoPago[] = [];

		for (let tp of tps) {
			tiposPago.push(this.getTipoPago(tp));
		}

		return tiposPago;
	}
}
