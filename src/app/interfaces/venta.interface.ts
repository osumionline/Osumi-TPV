export interface VentaLineaInterface {
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
}

export interface DevolucionSelectedInterface {
  localizador: number;
  unidades: number;
}
