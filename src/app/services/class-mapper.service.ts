import { Injectable } from "@angular/core";
import {
  ArticuloInterface,
  CategoriaInterface,
  ClienteInterface,
  CodigoBarrasInterface,
  EmpleadoInterface,
  MarcaInterface,
  ProveedorInterface,
  TipoPagoInterface,
} from "src/app/interfaces/interfaces";
import { Articulo } from "src/app/model/articulo.model";
import { Categoria } from "src/app/model/categoria.model";
import { Cliente } from "src/app/model/cliente.model";
import { CodigoBarras } from "src/app/model/codigobarras.model";
import { Empleado } from "src/app/model/empleado.model";
import { Marca } from "src/app/model/marca.model";
import { Proveedor } from "src/app/model/proveedor.model";
import { TipoPago } from "src/app/model/tipo-pago.model";

@Injectable({
  providedIn: "root",
})
export class ClassMapperService {
  constructor() {}

  getMarca(m: MarcaInterface): Marca {
    return new Marca().fromInterface(m);
  }

  getMarcas(ms: MarcaInterface[]): Marca[] {
    return ms.map((m: MarcaInterface): Marca => {
      return this.getMarca(m);
    });
  }

  getProveedor(p: ProveedorInterface): Proveedor {
    return new Proveedor().fromInterface(p);
  }

  getProveedores(ps: ProveedorInterface[]): Proveedor[] {
    return ps.map((p: ProveedorInterface): Proveedor => {
      return this.getProveedor(p);
    });
  }

  getCategoria(c: CategoriaInterface): Categoria {
    const hijos: Categoria[] = [];
    for (let h of c.hijos) {
      hijos.push(this.getCategoria(h));
    }
    return new Categoria().fromInterface(c, hijos);
  }

  getCategorias(cs: CategoriaInterface[]): Categoria[] {
    return cs.map((c: CategoriaInterface): Categoria => {
      return this.getCategoria(c);
    });
  }

  getCodigoBarras(cb: CodigoBarrasInterface): CodigoBarras {
    return new CodigoBarras().fromInterface(cb);
  }

  getCodigosBarras(cbs: CodigoBarrasInterface[]): CodigoBarras[] {
    return cbs.map((cb: CodigoBarrasInterface): CodigoBarras => {
      return this.getCodigoBarras(cb);
    });
  }

  getArticulo(a: ArticuloInterface): Articulo {
    return new Articulo().fromInterface(
      a,
      this.getCodigosBarras(a.codigosBarras)
    );
  }

  getArticulos(as: ArticuloInterface[]): Articulo[] {
    return as.map((a: ArticuloInterface): Articulo => {
      return this.getArticulo(a);
    });
  }

  getTipoPago(tp: TipoPagoInterface): TipoPago {
    return new TipoPago().fromInterface(tp);
  }

  getTiposPago(tps: TipoPagoInterface[]): TipoPago[] {
    return tps.map((tp: TipoPagoInterface): TipoPago => {
      return this.getTipoPago(tp);
    });
  }

  getCliente(c: ClienteInterface): Cliente {
    return new Cliente().fromInterface(c);
  }

  getClientes(cs: ClienteInterface[]): Cliente[] {
    return cs.map((c: ClienteInterface): Cliente => {
      return this.getCliente(c);
    });
  }

  getEmpleado(e: EmpleadoInterface): Empleado {
    return new Empleado().fromInterface(e);
  }

  getEmpleados(es: EmpleadoInterface[]): Empleado[] {
    return es.map((e: EmpleadoInterface): Empleado => {
      return this.getEmpleado(e);
    });
  }
}
