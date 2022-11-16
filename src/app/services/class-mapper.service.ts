import { Injectable } from "@angular/core";
import {
  AccesoDirectoInterface,
  ArticuloBuscadorInterface,
  ArticuloInterface,
  CategoriaInterface,
  ClienteInterface,
  CodigoBarrasInterface,
  ComercialInterface,
  EmpleadoInterface,
  HistoricoVentaInterface,
  MarcaInterface,
  ProveedorInterface,
  TipoPagoInterface,
  TopVentaArticuloInterface,
  UltimaVentaArticuloInterface,
} from "src/app/interfaces/interfaces";
import { AccesoDirecto } from "src/app/model/acceso-directo.model";
import { ArticuloBuscador } from "src/app/model/articulo-buscador.model";
import { Articulo } from "src/app/model/articulo.model";
import { Categoria } from "src/app/model/categoria.model";
import { Cliente } from "src/app/model/cliente.model";
import { CodigoBarras } from "src/app/model/codigobarras.model";
import { Comercial } from "src/app/model/comercial.model";
import { Empleado } from "src/app/model/empleado.model";
import { HistoricoVenta } from "src/app/model/historico-venta.model";
import { Marca } from "src/app/model/marca.model";
import { Proveedor } from "src/app/model/proveedor.model";
import { TipoPago } from "src/app/model/tipo-pago.model";
import { TopVentaArticulo } from "src/app/model/top-venta-articulo.model";
import { UltimaVentaArticulo } from "src/app/model/ultima-venta-articulo.model";

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

  getComercial(c: ComercialInterface): Comercial {
    return new Comercial().fromInterface(c);
  }

  getComerciales(cs: ComercialInterface[]): Comercial[] {
    return cs.map((c: ComercialInterface): Comercial => {
      return this.getComercial(c);
    });
  }

  getProveedor(p: ProveedorInterface): Proveedor {
    const comerciales: Comercial[] = this.getComerciales(p.comerciales);
    return new Proveedor().fromInterface(p, comerciales);
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

  getUltimaVentaArticulo(
    uva: UltimaVentaArticuloInterface
  ): UltimaVentaArticulo {
    return new UltimaVentaArticulo().fromInterface(uva);
  }

  getUltimaVentaArticulos(
    uvas: UltimaVentaArticuloInterface[]
  ): UltimaVentaArticulo[] {
    return uvas.map(
      (uva: UltimaVentaArticuloInterface): UltimaVentaArticulo => {
        return this.getUltimaVentaArticulo(uva);
      }
    );
  }

  getTopVentaArticulo(tva: TopVentaArticuloInterface): TopVentaArticulo {
    return new TopVentaArticulo().fromInterface(tva);
  }

  getTopVentaArticulos(tvas: TopVentaArticuloInterface[]): TopVentaArticulo[] {
    return tvas.map((tva: TopVentaArticuloInterface): TopVentaArticulo => {
      return this.getTopVentaArticulo(tva);
    });
  }

  getAccesoDirecto(ad: AccesoDirectoInterface): AccesoDirecto {
    return new AccesoDirecto().fromInterface(ad);
  }

  getAccesosDirectos(ads: AccesoDirectoInterface[]): AccesoDirecto[] {
    return ads.map((ad: AccesoDirectoInterface): AccesoDirecto => {
      return this.getAccesoDirecto(ad);
    });
  }

  getArticuloBuscador(ab: ArticuloBuscadorInterface): ArticuloBuscador {
    return new ArticuloBuscador().fromInterface(ab);
  }

  getArticulosBuscador(abs: ArticuloBuscadorInterface[]): ArticuloBuscador[] {
    return abs.map((ab: ArticuloBuscadorInterface): ArticuloBuscador => {
      return this.getArticuloBuscador(ab);
    });
  }

  getHistoricoVentas(hvs: HistoricoVentaInterface[]): HistoricoVenta[] {
    return hvs.map((hv: HistoricoVentaInterface): HistoricoVenta => {
      return new HistoricoVenta().fromInterface(hv);
    });
  }
}
