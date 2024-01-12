export interface BuscadorAlmacenInterface {
  idProveedor: number;
  idMarca: number;
  nombre: string;
  orderBy: string;
  orderSent: string;
  pagina: number;
  num: number;
}

export interface InventarioItemInterface {
  id: number;
  localizador: number;
  marca: string;
  proveedor: string;
  referencia: string;
  nombre: string;
  stock: number;
  puc: number;
  pvp: number;
  hasCodigosBarras: boolean;
  codigoBarras?: string;
  observaciones: string;
}

export interface BuscadorAlmacenResult {
  status: string;
  list: InventarioItemInterface[];
  pags: number;
  total: number;
}
