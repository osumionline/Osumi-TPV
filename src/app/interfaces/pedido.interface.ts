export interface PedidoLineaInterface {
  id: number;
  idArticulo: number;
  nombreArticulo: string;
  localizador: number;
  idMarca: number;
  marca: string;
  unidades: number;
  palb: number;
  pvp: number;
  stock: number;
  iva: number;
  re: number;
  descuento: number;
  idCategoria: number;
  codBarras: number;
  referencia: string;
}

export interface PedidoPDFInterface {
  id: number;
  data: string;
  nombre: string;
  url: string;
  deleted: boolean;
}

export interface PedidoInterface {
  id: number;
  idProveedor: number;
  proveedor: string;
  re: boolean;
  ue: boolean;
  albaranFactura: string;
  numAlbaranFactura: string;
  fechaPago: string;
  fechaPedido: string;
  lineas: PedidoLineaInterface[];
  importe: number;
  portes: number;
  faltas: boolean;
  recepcionado: boolean;
  pdfs: PedidoPDFInterface[];
}

export interface PedidosFilterInterface {
  fechaDesde: string;
  fechaHasta: string;
  idProveedor: number;
  albaran: string;
  importeDesde: number;
  importeHasta: number;
  pagina: number;
}

export interface PedidosAllResult {
  status: string;
  guardados: PedidoInterface[];
  recepcionados: PedidoInterface[];
  guardadosPags: number;
  recepcionadosPags: number;
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
