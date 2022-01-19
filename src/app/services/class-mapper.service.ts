import { Injectable }   from '@angular/core';
import { Marca }        from 'src/app/model/marca.model';
import { Proveedor }    from 'src/app/model/proveedor.model';
import { Categoria }    from 'src/app/model/categoria.model';
import { Articulo }     from 'src/app/model/articulo.model';
import { CodigoBarras } from 'src/app/model/codigobarras.model';
import { Tarjeta }      from 'src/app/model/tarjeta.model';
import { MarcaInterface, ProveedorInterface, CategoriaInterface, ArticuloInterface, CodigoBarrasInterface, TarjetaInterface } from 'src/app/interfaces/interfaces';

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

	getTarjeta(t: TarjetaInterface): Tarjeta {
		return new Tarjeta().fromInterface(t);
	}

	getTarjetas(ts: TarjetaInterface[]): Tarjeta[] {
		const tarjetas: Tarjeta[] = [];

		for (let t of ts) {
			tarjetas.push(this.getTarjeta(t));
		}

		return tarjetas;
	}
}
