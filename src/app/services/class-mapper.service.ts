import { Injectable } from "@angular/core";
import { InventarioItemInterface } from "@interfaces/almacen.interface";
import {
  AccesoDirectoInterface,
  ArticuloBuscadorInterface,
  ArticuloInterface,
  CategoriaInterface,
  CodigoBarrasInterface,
  HistoricoArticuloInterface,
} from "@interfaces/articulo.interface";
import {
  CierreCajaInterface,
  SalidaCajaInterface,
  VentaHistoricoInterface,
  VentaLineaHistoricoInterface,
} from "@interfaces/caja.interface";
import {
  ClienteInterface,
  FacturaInterface,
  ReservaInterface,
} from "@interfaces/cliente.interface";
import { EmpleadoInterface } from "@interfaces/empleado.interface";
import { InformeMensualItemInterface } from "@interfaces/informes.interface";
import { BackupInterface } from "@interfaces/interfaces";
import { MarcaInterface } from "@interfaces/marca.interface";
import { PedidoInterface } from "@interfaces/pedido.interface";
import {
  ComercialInterface,
  ProveedorInterface,
} from "@interfaces/proveedor.interface";
import { TipoPagoInterface } from "@interfaces/tipo-pago.interface";
import {
  ArticuloTopVentaInterface,
  ArticuloUltimaVentaInterface,
  VentaFinInterface,
} from "@interfaces/venta.interface";
import { InventarioItem } from "@model/almacen/inventario-item.model";
import { AccesoDirecto } from "@model/articulos/acceso-directo.model";
import { ArticuloBuscador } from "@model/articulos/articulo-buscador.model";
import { ArticuloTopVenta } from "@model/articulos/articulo-top-venta.model";
import { ArticuloUltimaVenta } from "@model/articulos/articulo-ultima-venta.model";
import { Articulo } from "@model/articulos/articulo.model";
import { Categoria } from "@model/articulos/categoria.model";
import { CodigoBarras } from "@model/articulos/codigo-barras.model";
import { HistoricoArticulo } from "@model/articulos/historico-articulo.model";
import { CierreCaja } from "@model/caja/cierre-caja.model";
import { InformeMensualItem } from "@model/caja/informe-mensual-item.model";
import { SalidaCaja } from "@model/caja/salida-caja.model";
import { VentaHistorico } from "@model/caja/venta-historico.model";
import { VentaLineaHistorico } from "@model/caja/venta-linea-historico.model";
import { Cliente } from "@model/clientes/cliente.model";
import { Factura } from "@model/clientes/factura.model";
import { Pedido } from "@model/compras/pedido.model";
import { Marca } from "@model/marcas/marca.model";
import { Comercial } from "@model/proveedores/comercial.model";
import { Proveedor } from "@model/proveedores/proveedor.model";
import { Backup } from "@model/tpv/backup.model";
import { Empleado } from "@model/tpv/empleado.model";
import { TipoPago } from "@model/tpv/tipo-pago.model";
import { Reserva } from "@model/ventas/reserva.model";
import { VentaFin } from "@model/ventas/venta-fin.model";

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
    for (const h of c.hijos) {
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

  getBackups(bs: BackupInterface[]): Backup[] {
    return bs.map((b: BackupInterface): Backup => {
      return new Backup().fromInterface(b);
    });
  }

  getHistoricoArticulo(ha: HistoricoArticuloInterface): HistoricoArticulo {
    return new HistoricoArticulo().fromInterface(ha);
  }

  getHistoricoArticulos(
    has: HistoricoArticuloInterface[]
  ): HistoricoArticulo[] {
    return has.map((ha: HistoricoArticuloInterface): HistoricoArticulo => {
      return this.getHistoricoArticulo(ha);
    });
  }
}
