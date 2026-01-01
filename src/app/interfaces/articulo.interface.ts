export interface CategoriaInterface {
  id: number;
  nombre: string | null;
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
  id: number | null;
  codigoBarras: string | null;
  porDefecto: boolean;
}

export interface FotoInterface {
  status: string;
  id: number | null;
  data: string | null;
}

export interface ArticuloInterface {
  id: number | null;
  localizador: number | null;
  nombre: string | null;
  idCategoria: number | null;
  idMarca: number | null;
  idProveedor: number | null;
  referencia: string;
  palb: number;
  puc: number;
  pvp: number | null;
  pvpDescuento: number | null;
  iva: number;
  re: number;
  margen: number;
  margenDescuento: number | null;
  stock: number;
  stockMin: number;
  stockMax: number;
  loteOptimo: number;
  ventaOnline: boolean;
  fechaCaducidad: string | null;
  mostrarEnWeb: boolean;
  descCorta: string | null;
  descripcion: string | null;
  observaciones: string | null;
  mostrarObsPedidos: boolean;
  mostrarObsVentas: boolean;
  accesoDirecto: number | null;
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
  localizador: number | null;
  nombre: string | null;
  marca: string | null;
  pvp: number | null;
  stock: number | null;
}

export interface ArticuloBuscadorResult {
  status: string;
  list: ArticuloBuscadorInterface[];
}

export interface AccesoDirectoInterface {
  id: number | null;
  accesoDirecto: number | null;
  nombre: string | null;
}

export interface AccesoDirectoResult {
  list: AccesoDirectoInterface[];
}

export interface EtiquetaInterface {
  id: number | null;
  texto: string | null;
  slug: string | null;
}

export interface EtiquetaWebInterface {
  id: number | null;
  texto: string | null;
  slug: string | null;
}

export interface HistoricoArticuloInterface {
  id: number | null;
  tipo: number | null;
  stockPrevio: number | null;
  diferencia: number | null;
  stockFinal: number | null;
  idVenta: number | null;
  idPedido: number | null;
  puc: number | null;
  pvp: number | null;
  createdAt: string | null;
}

export interface HistoricoArticuloResult {
  status: string;
  pags: number;
  list: HistoricoArticuloInterface[];
}

export interface HistoricoArticuloBuscadorInterface {
  id: number | null;
  orderBy: string | null;
  orderSent: string | null;
  pagina: number;
  num: number;
}
