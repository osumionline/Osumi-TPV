import { Injectable } from "@angular/core";
import { InventarioItemInterface } from "src/app/interfaces/almacen.interface";
import {
  AccesoDirectoInterface,
  ArticuloBuscadorInterface,
  ArticuloInterface,
  CategoriaInterface,
  CodigoBarrasInterface,
} from "src/app/interfaces/articulo.interface";
import {
  CierreCajaInterface,
  SalidaCajaInterface,
  VentaHistoricoInterface,
} from "src/app/interfaces/caja.interface";
import {
  ClienteInterface,
  FacturaInterface,
} from "src/app/interfaces/cliente.interface";
import { EmpleadoInterface } from "src/app/interfaces/empleado.interface";
import { MarcaInterface } from "src/app/interfaces/marca.interface";
import { PedidoInterface } from "src/app/interfaces/pedido.interface";
import {
  ComercialInterface,
  ProveedorInterface,
} from "src/app/interfaces/proveedor.interface";
import { TipoPagoInterface } from "src/app/interfaces/tipo-pago.interface";
import {
  ArticuloTopVentaInterface,
  ArticuloUltimaVentaInterface,
  VentaFinInterface,
} from "src/app/interfaces/venta.interface";
import { AccesoDirecto } from "src/app/model/acceso-directo.model";
import { ArticuloBuscador } from "src/app/model/articulo-buscador.model";
import { ArticuloTopVenta } from "src/app/model/articulo-top-venta.model";
import { ArticuloUltimaVenta } from "src/app/model/articulo-ultima-venta.model";
import { Articulo } from "src/app/model/articulo.model";
import { Categoria } from "src/app/model/categoria.model";
import { CierreCaja } from "src/app/model/cierre-caja.model";
import { Cliente } from "src/app/model/cliente.model";
import { CodigoBarras } from "src/app/model/codigo-barras.model";
import { Comercial } from "src/app/model/comercial.model";
import { Empleado } from "src/app/model/empleado.model";
import { Factura } from "src/app/model/factura.model";
import { InventarioItem } from "src/app/model/inventario-item.model";
import { Marca } from "src/app/model/marca.model";
import { Pedido } from "src/app/model/pedido.model";
import { Proveedor } from "src/app/model/proveedor.model";
import { SalidaCaja } from "src/app/model/salida-caja.model";
import { TipoPago } from "src/app/model/tipo-pago.model";
import { VentaFin } from "src/app/model/venta-fin.model";
import { VentaHistorico } from "src/app/model/venta-historico.model";

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
    return new Articulo().fromInterface(a);
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
    uva: ArticuloUltimaVentaInterface
  ): ArticuloUltimaVenta {
    return new ArticuloUltimaVenta().fromInterface(uva);
  }

  getUltimaVentaArticulos(
    uvas: ArticuloUltimaVentaInterface[]
  ): ArticuloUltimaVenta[] {
    return uvas.map(
      (uva: ArticuloUltimaVentaInterface): ArticuloUltimaVenta => {
        return this.getUltimaVentaArticulo(uva);
      }
    );
  }

  getTopVentaArticulo(tva: ArticuloTopVentaInterface): ArticuloTopVenta {
    return new ArticuloTopVenta().fromInterface(tva);
  }

  getTopVentaArticulos(tvas: ArticuloTopVentaInterface[]): ArticuloTopVenta[] {
    return tvas.map((tva: ArticuloTopVentaInterface): ArticuloTopVenta => {
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

  getHistoricoVentas(hvs: VentaHistoricoInterface[]): VentaHistorico[] {
    return hvs.map((hv: VentaHistoricoInterface): VentaHistorico => {
      return new VentaHistorico().fromInterface(hv);
    });
  }

  getSalidaCaja(sc: SalidaCajaInterface): SalidaCaja {
    return new SalidaCaja().fromInterface(sc);
  }

  getSalidasCaja(scs: SalidaCajaInterface[]): SalidaCaja[] {
    return scs.map((sc: SalidaCajaInterface): SalidaCaja => {
      return this.getSalidaCaja(sc);
    });
  }

  getCierreCaja(cc: CierreCajaInterface): CierreCaja {
    return new CierreCaja().fromInterface(cc);
  }

  getVentaFin(vf: VentaFinInterface): VentaFin {
    return new VentaFin().fromInterface(vf);
  }

  getPedido(p: PedidoInterface): Pedido {
    return new Pedido().fromInterface(p);
  }

  getPedidos(ps: PedidoInterface[]): Pedido[] {
    return ps.map((p: PedidoInterface): Pedido => {
      return this.getPedido(p);
    });
  }

  getFactura(f: FacturaInterface): Factura {
    return new Factura().fromInterface(f);
  }

  getFacturas(fs: FacturaInterface[]): Factura[] {
    return fs.map((f: FacturaInterface): Factura => {
      return this.getFactura(f);
    });
  }

  getInventarioItem(ii: InventarioItemInterface): InventarioItem {
    return new InventarioItem().fromInterface(ii);
  }

  getInventarioItems(iis: InventarioItemInterface[]): InventarioItem[] {
    return iis.map((ii: InventarioItemInterface): InventarioItem => {
      return this.getInventarioItem(ii);
    });
  }
}
