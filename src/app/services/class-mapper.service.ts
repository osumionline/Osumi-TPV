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
  VentaLineaHistoricoInterface,
} from "src/app/interfaces/caja.interface";
import {
  ClienteInterface,
  FacturaInterface,
  ReservaInterface,
} from "src/app/interfaces/cliente.interface";
import { EmpleadoInterface } from "src/app/interfaces/empleado.interface";
import { InformeMensualItemInterface } from "src/app/interfaces/informes.interface";
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
import { InventarioItem } from "src/app/model/almacen/inventario-item.model";
import { AccesoDirecto } from "src/app/model/articulos/acceso-directo.model";
import { ArticuloBuscador } from "src/app/model/articulos/articulo-buscador.model";
import { ArticuloTopVenta } from "src/app/model/articulos/articulo-top-venta.model";
import { ArticuloUltimaVenta } from "src/app/model/articulos/articulo-ultima-venta.model";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { Categoria } from "src/app/model/articulos/categoria.model";
import { CodigoBarras } from "src/app/model/articulos/codigo-barras.model";
import { CierreCaja } from "src/app/model/caja/cierre-caja.model";
import { SalidaCaja } from "src/app/model/caja/salida-caja.model";
import { VentaHistorico } from "src/app/model/caja/venta-historico.model";
import { Cliente } from "src/app/model/clientes/cliente.model";
import { Factura } from "src/app/model/clientes/factura.model";
import { Pedido } from "src/app/model/compras/pedido.model";
import { Marca } from "src/app/model/marcas/marca.model";
import { Comercial } from "src/app/model/proveedores/comercial.model";
import { Proveedor } from "src/app/model/proveedores/proveedor.model";
import { Empleado } from "src/app/model/tpv/empleado.model";
import { TipoPago } from "src/app/model/tpv/tipo-pago.model";
import { Reserva } from "src/app/model/ventas/reserva.model";
import { VentaFin } from "src/app/model/ventas/venta-fin.model";
import { InformeMensualItem } from "../model/caja/informe-mensual-item.model";
import { VentaLineaHistorico } from "../model/caja/venta-linea-historico.model";

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

  getHistoricoVentaLineas(
    hvls: VentaLineaHistoricoInterface[]
  ): VentaLineaHistorico[] {
    return hvls.map(
      (hvl: VentaLineaHistoricoInterface): VentaLineaHistorico => {
        return new VentaLineaHistorico().fromInterface(hvl);
      }
    );
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

  getInformeMensualItem(imi: InformeMensualItemInterface): InformeMensualItem {
    return new InformeMensualItem().fromInterface(imi);
  }

  getInformeMensualItems(
    imis: InformeMensualItemInterface[]
  ): InformeMensualItem[] {
    return imis.map((imi: InformeMensualItemInterface): InformeMensualItem => {
      return this.getInformeMensualItem(imi);
    });
  }

  getReservas(rs: ReservaInterface[]): Reserva[] {
    return rs.map((r: ReservaInterface): Reserva => {
      return new Reserva().fromInterface(r);
    });
  }
}
