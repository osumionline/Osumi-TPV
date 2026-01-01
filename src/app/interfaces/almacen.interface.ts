export interface BuscadorAlmacenInterface {
  idProveedor: number | null;
  idMarca: number | null;
  nombre: string | null;
  descuento: boolean;
  orderBy: string | null;
  orderSent: string | null;
  pagina: number;
  num: number | null;
}

export interface InventarioItemInterface {
  id: number | null;
  localizador: number | null;
  marca: string | null;
  proveedor: string | null;
  referencia: string | null;
  nombre: string | null;
  stock: number | null;
  puc: number | null;
  pvp: number | null;
  hasCodigosBarras: boolean;
  codigoBarras?: string | null;
  observaciones: string | null;
}

export interface BuscadorAlmacenResult {
  status: string;
  list: InventarioItemInterface[];
  pags: number;
  totalPVP: number;
  totalPUC: number;
}
