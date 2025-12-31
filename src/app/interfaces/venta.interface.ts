import { ArticuloInterface } from '@interfaces/articulo.interface';
import { VentaLineaHistoricoInterface } from '@interfaces/caja.interface';

export interface VentaLineaInterface {
  id: number | null;
  idArticulo: number | null;
  localizador: number | null;
  descripcion: string | null;
  marca: string | null;
  stock: number | null;
  cantidad: number | null;
  pvp: number | null;
  importe: number | null;
  descuento: number | null;
  descuentoManual: boolean;
  iva: number | null;
  observaciones: string | null;
  fromVenta: number | null;
  fromReserva: number | null;
  fromReservaLineaId: number | null;
  regalo: boolean;
}

export interface VentaInterface {
  idEmpleado: number | null;
  lineas: VentaLineaInterface[];
  importe: number;
}

export interface VentaFinInterface {
  efectivo: number | null;
  cambio: number | null;
  tarjeta: number | null;
  idEmpleado: number | null;
  idTipoPago: number | null;
  idCliente: number | null;
  total: number;
  lineas: VentaLineaInterface[];
  pagoMixto: boolean;
  imprimir: string | null;
  email: string | null;
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
  fecha: string | null;
  localizador: number | null;
  nombre: string | null;
  unidades: number | null;
  pvp: number | null;
  importe: number | null;
}

export interface ArticuloTopVentaInterface {
  localizador: number | null;
  nombre: string | null;
  importe: number | null;
  unidades: number | null;
}

export interface DevolucionSelectedInterface {
  id: number | null;
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

export interface VentaVariosInterface {
  nombre: string;
  pvp: number;
  iva: number;
}
