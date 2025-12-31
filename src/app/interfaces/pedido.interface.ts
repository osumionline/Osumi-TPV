export interface PedidoLineaInterface {
  id: number | null;
  idArticulo: number | null;
  nombreArticulo: string | null;
  localizador: number | null;
  idMarca: number | null;
  marca: string | null;
  unidades: number | null;
  palb: number | null;
  puc: number | null;
  pvp: number | null;
  margen: number | null;
  stock: number | null;
  iva: number | null;
  re: number | null;
  descuento: number | null;
  codBarras: string | null;
  hasCodBarras: boolean;
  referencia: string | null;
}

export interface PedidoPDFInterface {
  id: number | null;
  data: string | null;
  nombre: string | null;
  url: string | null;
  deleted: boolean;
}

export interface PedidoVistaInterface {
  idColumn: number | null;
  status: boolean;
}

export interface PedidoInterface {
  id: number | null;
  idProveedor: number;
  proveedor: string | null;
  idMetodoPago: number | null;
  metodoPago: string | null;
  re: boolean;
  ue: boolean;
  tipo: string;
  num: string | null;
  fechaPago: string | null;
  fechaPedido: string | null;
  fechaRecepcionado: string | null;
  lineas: PedidoLineaInterface[];
  importe: number | null;
  portes: number;
  descuento: number;
  faltas: boolean;
  recepcionado: boolean;
  observaciones: string | null;
  pdfs: PedidoPDFInterface[];
  vista: PedidoVistaInterface[];
}

export interface PedidosFilterInterface {
  fechaDesde: string;
  fechaHasta: string;
  idProveedor: number;
  albaran: string;
  importeDesde: number;
  importeHasta: number;
  pagina: number;
  num: number;
}

export interface PedidosAllResult {
  status: string;
  guardados: PedidoInterface[];
  recepcionados: PedidoInterface[];
  guardadosPags: number;
  recepcionadosPags: number;
}

export interface PedidoSaveResult {
  status: string;
  id: number;
  message: string;
}

export interface PedidoResult {
  status: string;
  pedido: PedidoInterface;
}

export interface PedidosResult {
  status: string;
  list: PedidoInterface[];
  pags: number;
}

export interface PedidosColOption {
  id: number;
  value: string;
  colname: string;
  selected: boolean;
  default: boolean;
}

export interface TotalsIVAOption {
  tipoIva: string;
  ivaOption: number;
  iva: number;
  reOption: number;
  re: number;
}
