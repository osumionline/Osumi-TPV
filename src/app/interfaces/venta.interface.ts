export interface LineaVentaInterface {
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
  observaciones: string;
}

export interface VentaInterface {
  idEmpleado: number;
  lineas: LineaVentaInterface[];
  importe: number;
}

export interface FinVentaInterface {
  efectivo: number;
  cambio: number;
  tarjeta: number;
  idEmpleado: number;
  idTipoPago: number;
  idCliente: number;
  total: number;
  lineas: LineaVentaInterface[];
  pagoMixto: boolean;
  factura: boolean;
  regalo: boolean;
}

export interface FinVentaResult {
  status: string;
  id: number;
  importe: number;
  cambio: number;
}

export interface FacturaResult {
  status: string;
  factura: FinVentaInterface;
}

export interface UltimaVentaArticuloInterface {
  fecha: string;
  localizador: number;
  nombre: string;
  unidades: number;
  pvp: number;
  importe: number;
}

export interface TopVentaArticuloInterface {
  localizador: number;
  nombre: string;
  importe: number;
}
