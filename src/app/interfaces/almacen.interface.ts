export interface BuscadorAlmacenInterface {
  idProveedor: number;
  idMarca: number;
  nombre: string;
  orderBy: string;
  orderSent: string;
  pagina: number;
}

export interface BuscadorAlmacenItemInterface {
  idArticulo: number;
  localizador: number;
  marca: string;
  referencia: string;
  descripcion: string;
  stock: number;
  pvp: number;
  margen: number;
}

export interface BuscadorAlmacenResult {
  status: string;
  list: BuscadorAlmacenItemInterface[];
}
