export interface CategoriaInterface {
  id: number;
  nombre: string;
  profundidad: number;
  hijos: CategoriaInterface[];
}

export interface CategoriasResult {
  list: CategoriaInterface;
}

export interface ChartSelectInterface {
  data: string;
  type: string;
  month: number;
  year: number;
}

export interface ChartSeriesInterface {
  name: string;
  value: number;
}

export interface ChartDataInterface {
  name: string;
  series: ChartSeriesInterface[];
}

export interface ChartResultInterface {
  status: string;
  data: ChartDataInterface[];
}

export interface CodigoBarrasInterface {
  id: number;
  codigoBarras: string;
  porDefecto: boolean;
}

export interface FotoInterface {
  status: string;
  id: number;
  data: string;
}

export interface ArticuloInterface {
  id: number;
  localizador: number;
  nombre: string;
  idCategoria: number;
  idMarca: number;
  idProveedor: number;
  referencia: string;
  palb: number;
  puc: number;
  pvp: number;
  pvpDescuento: number;
  iva: number;
  re: number;
  margen: number;
  margenDescuento: number;
  stock: number;
  stockMin: number;
  stockMax: number;
  loteOptimo: number;
  ventaOnline: boolean;
  fechaCaducidad: string;
  mostrarEnWeb: boolean;
  descCorta: string;
  descripcion: string;
  observaciones: string;
  mostrarObsPedidos: boolean;
  mostrarObsVentas: boolean;
  accesoDirecto: number;
  codigosBarras: CodigoBarrasInterface[];
  fotos: number[];
  fotosList?: FotoInterface[];
  nombreStatus?: string;
  etiquetas: EtiquetaInterface[];
  etiquetasWeb: EtiquetaWebInterface[];
}

export interface ArticuloSaveResult {
  status: string;
  localizador: number;
  message: string;
}

export interface ArticuloResult {
  status: string;
  articulo: ArticuloInterface;
}

export interface ArticuloBuscadorInterface {
  localizador: number;
  nombre: string;
  marca: string;
  pvp: number;
  stock: number;
}

export interface ArticuloBuscadorResult {
  status: string;
  list: ArticuloBuscadorInterface[];
}

export interface AccesoDirectoInterface {
  id: number;
  accesoDirecto: number;
  nombre: string;
}

export interface AccesoDirectoResult {
  list: AccesoDirectoInterface[];
}

export interface EtiquetaInterface {
  id: number;
  texto: string;
  slug: string;
}

export interface EtiquetaWebInterface {
  id: number;
  texto: string;
  slug: string;
}

export interface HistoricoArticuloInterface {
  id: number;
  tipo: number;
  stockPrevio: number;
  diferencia: number;
  stockFinal: number;
  idVenta: number;
  idPedido: number;
  puc: number;
  pvp: number;
  createdAt: string;
}

export interface HistoricoArticuloResult {
  status: string;
  pags: number;
  list: HistoricoArticuloInterface[];
}

export interface HistoricoArticuloBuscadorInterface {
  id: number;
  orderBy: string;
  orderSent: string;
  pagina: number;
  num: number;
}
