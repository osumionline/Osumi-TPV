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
  codigoBarras: number;
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
  iva: number;
  re: number;
  margen: number;
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

export interface SearchArticulosResult {
  status: string;
  list: ArticuloInterface[];
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
