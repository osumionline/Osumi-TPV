import { ArticuloInterface } from '@interfaces/articulo.interface';
import { VentaLineaHistoricoInterface } from '@interfaces/caja.interface';

export interface VentaLineaInterface {
  id: number;
  idArticulo: number;
  localizador: number;
  descripcion: string;
  marca: string;
  stock: number;
  cantidad: number;
  pvp: number;
  importe: number;
  descuento: number;
  descuentoManual: boolean;
  iva: number;
  observaciones: string;
  fromVenta: number;
  fromReserva: number;
  fromReservaLineaId: number;
  regalo: boolean;
}

export interface VentaInterface {
  idEmpleado: number;
  lineas: VentaLineaInterface[];
  importe: number;
}

export interface VentaFinInterface {
  efectivo: number;
  cambio: number;
  tarjeta: number;
  idEmpleado: number;
  idTipoPago: number;
  idCliente: number;
  total: number;
  lineas: VentaLineaInterface[];
  pagoMixto: boolean;
  imprimir: string;
  email: string;
}

export interface FinVentaResult {
  status: string;
  id: number;
  importe: number;
  cambio: number;
}

export interface VentaResult {
  status: string;
  venta: VentaFinInterface;
}

export interface ArticuloUltimaVentaInterface {
  fecha: string;
  localizador: number;
  nombre: string;
  unidades: number;
  pvp: number;
  importe: number;
}

export interface ArticuloTopVentaInterface {
  localizador: number;
  nombre: string;
  importe: number;
  unidades: number;
}

export interface DevolucionSelectedInterface {
  id: number;
  unidades: number;
}

export interface LineasTicketResult {
  status: string;
  list: VentaLineaHistoricoInterface[];
}

export interface LocalizadoresResult {
  status: string;
  list: ArticuloInterface[];
}
