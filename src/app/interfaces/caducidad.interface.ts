import { ArticuloInterface } from '@interfaces/articulo.interface';

export interface CaducidadInterface {
  id: number;
  articulo: ArticuloInterface;
  unidades: number;
  pvp: number;
  puc: number;
  createdAt: string;
}

export interface BuscadorCaducidadesInterface {
  year: number;
  month: number;
  pagina: number;
  num: number;
  idMarca: number;
  nombre: string;
  orderBy: string;
  orderSent: string;
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
