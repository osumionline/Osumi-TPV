import { ArticuloInterface } from '@interfaces/articulo.interface';

export interface CaducidadInterface {
  id: number | null;
  articulo: ArticuloInterface | null;
  unidades: number | null;
  pvp: number | null;
  puc: number | null;
  createdAt: string | null;
}

export interface BuscadorCaducidadesInterface {
  year: number | null;
  month: number | null;
  pagina: number;
  num: number;
  idMarca: number | null;
  nombre: string | null;
  orderBy: string | null;
  orderSent: string | null;
}

export interface BuscadorCaducidadResult {
  status: string;
  list: CaducidadInterface[];
  pags: number;
  totalUnidades: number;
  totalPVP: number;
  totalPUC: number;
}

export interface AddCaducidadInterface {
  idArticulo: number;
  unidades: number;
}
