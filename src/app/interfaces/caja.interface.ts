export interface VentaLineaHistoricoInterface {
  id: number | null;
  idArticulo: number | null;
  articulo: string | null;
  localizador: number | null;
  marca: string | null;
  puc: number | null;
  pvp: number | null;
  iva: number | null;
  re: number | null;
  importe: number | null;
  descuento: number | null;
  importeDescuento: number | null;
  devuelto: number | null;
  unidades: number | null;
  regalo: boolean;
}

export interface VentaHistoricoInterface {
  id: number | null;
  editable: boolean;
  idEmpleado: number | null;
  idCliente: number | null;
  cliente: string | null;
  total: number | null;
  entregado: number | null;
  pagoMixto: boolean;
  idTipoPago: number | null;
  nombreTipoPago: string | null;
  entregadoOtro: number | null;
  saldo: number | null;
  facturada: boolean;
  statusFactura: string | null;
  fecha: string | null;
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
  id: number | null;
  concepto: string | null;
  descripcion: string | null;
  importe: number | null;
  fecha: string | null;
  editable: boolean;
}

export interface SalidaCajaResult {
  status: string;
  list: SalidaCajaInterface[];
}

export interface CierreCajaTipoInterface {
  id: number | null;
  nombre: string | null;
  ventas: number | null;
  real?: number | null;
  operaciones: number | null;
}

export interface CierreCajaInterface {
  date: string | null;
  saldoInicial: number | null;
  importeEfectivo: number | null;
  salidasCaja: number | null;
  saldoFinal: number | null;
  real: number | null;
  importe1c: number | null;
  importe2c: number | null;
  importe5c: number | null;
  importe10c: number | null;
  importe20c: number | null;
  importe50c: number | null;
  importe1: number | null;
  importe2: number | null;
  importe5: number | null;
  importe10: number | null;
  importe20: number | null;
  importe50: number | null;
  importe100: number | null;
  importe200: number | null;
  importe500: number | null;
  retirado: number | null;
  entrada: number | null;
  tipos: CierreCajaTipoInterface[];
}

export interface CierreCajaResult {
  status: string;
  datos: CierreCajaInterface;
}
