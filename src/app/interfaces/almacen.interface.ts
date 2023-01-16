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
  referencia: string;
  nombre: string;
  stock: number;
  puc: number;
  pvp: number;
  hasCodigosBarras: boolean;
  codigoBarras?: number;
}

export interface BuscadorAlmacenResult {
  status: string;
  list: InventarioItemInterface[];
  pags: number;
}