export interface PedidoLineaInterface {
  id: number;
  idArticulo: number;
  nombreArticulo: string;
  localizador: number;
  idMarca: number;
  marca: string;
  unidades: number;
  palb: number;
  puc: number;
  pvp: number;
  margen: number;
  stock: number;
  iva: number;
  re: number;
  descuento: number;
  idCategoria: number;
  codBarras: string;
  hasCodBarras: boolean;
  referencia: string;
}

export interface PedidoPDFInterface {
  id: number;
  data: string;
  nombre: string;
  url: string;
  deleted: boolean;
}

export interface PedidoVistaInterface {
  idColumn: number;
  status: boolean;
}

export interface PedidoInterface {
  id: number;
  idProveedor: number;
  proveedor: string;
  idMetodoPago: number;
  metodoPago: string;
  re: boolean;
  ue: boolean;
  tipo: string;
  num: string;
  fechaPago: string;
  fechaPedido: string;
  fechaRecepcionado: string;
  lineas: PedidoLineaInterface[];
  importe: number;
  portes: number;
  descuento: number;
  faltas: boolean;
  recepcionado: boolean;
  observaciones: string;
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
