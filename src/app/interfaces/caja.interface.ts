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
  facturada: boolean;
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
  ventasBeneficio: number;
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
  date: string;
  saldoInicial: number;
  importeEfectivo: number;
  salidasCaja: number;
  saldoFinal: number;
  real: number;
  importe1c: number;
  importe2c: number;
  importe5c: number;
  importe10c: number;
  importe20c: number;
  importe50c: number;
  importe1: number;
  importe2: number;
  importe5: number;
  importe10: number;
  importe20: number;
  importe50: number;
  importe100: number;
  importe200: number;
  importe500: number;
  retirado: number;
  tipos: CierreCajaTipoInterface[];
}

export interface CierreCajaResult {
  status: string;
  datos: CierreCajaInterface;
}
