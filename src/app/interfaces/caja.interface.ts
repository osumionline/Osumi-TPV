export interface VentaLineaHistoricoInterface {
  id: number;
  idArticulo: number;
  articulo: string;
  localizador: number;
  marca: string;
  puc: number;
  pvp: number;
  iva: number;
  re: number;
  importe: number;
  descuento: number;
  importeDescuento: number;
  devuelto: number;
  unidades: number;
}

export interface VentaHistoricoInterface {
  id: number;
  editable: boolean;
  idEmpleado: number;
  idCliente: number;
  cliente: string;
  total: number;
  entregado: number;
  pagoMixto: boolean;
  idTipoPago: number;
  nombreTipoPago: string;
  entregadoOtro: number;
  saldo: number;
  fecha: string;
  lineas: VentaLineaHistoricoInterface[];
}

export interface VentaHistoricoOtrosInterface {
  nombre: string;
  valor: number;
}

export interface HistoricoVentasResult {
  status: string;
  list: VentaHistoricoInterface[];
  totalDia: number;
  ventasEfectivo: number;
  ventasOtros: VentaHistoricoOtrosInterface[];
  ventasWeb: number;
}

export interface SalidaCajaInterface {
  id: number;
  concepto: string;
  descripcion: string;
  importe: number;
  fecha: string;
  editable: boolean;
}

export interface SalidaCajaResult {
  status: string;
  list: SalidaCajaInterface[];
}

export interface CierreCajaTipoInterface {
  id: number;
  nombre: string;
  ventas: number;
  real?: number;
  operaciones: number;
}

export interface CierreCajaInterface {
  date?: string;
  saldoInicial: number;
  importeEfectivo: number;
  salidasCaja: number;
  saldoFinal: number;
  real?: number;
  retirado?: number;
  tipos: CierreCajaTipoInterface[];
}

export interface CierreCajaResult {
  status: string;
  datos: CierreCajaInterface;
}
