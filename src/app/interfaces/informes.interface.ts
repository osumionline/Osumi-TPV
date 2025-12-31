export interface InformeMensualItemOtrosInterface {
  nombre: string;
  valor: number;
}

export interface InformeMensualItemInterface {
  num: number | null;
  weekDay: string | null;
  minTicket: number | null;
  maxTicket: number | null;
  efectivo: number | null;
  otros: InformeMensualItemOtrosInterface[];
  totalDia: number | null;
  suma: number | null;
}

export interface InformeMensualResult {
  status: string;
  list: InformeMensualItemInterface[];
}

export interface InformeCaducidadesBrandInterface {
  name: string;
  totalUnidades: number;
  totalPVP: number;
  totalPUC: number;
}

export interface InformeCaducidadesMonthInterface {
  month: number;
  totalUnidades: number;
  totalPVP: number;
  totalPUC: number;
  brands: InformeCaducidadesBrandInterface[];
}

export interface InformeCaducidadesYearInterface {
  year: number;
  totalUnidades: number;
  totalPVP: number;
  totalPUC: number;
  months: InformeCaducidadesMonthInterface[];
}

export interface InformeCaducidadesResult {
  status: string;
  data: InformeCaducidadesYearInterface[];
}

export interface InformeDetalladoMarcaInterface {
  marca: string;
  total_ventas_pvp: number;
  total_beneficio: number;
  margen: number;
  margen_anterior: number;
  margen_diferencia: number;
  porcentaje_sobre_total: number;
}

export interface InformeDetalladoArticuloInterface {
  id_articulo: number;
  nombre: string;
  marca: string;
  total_unidades_vendidas: number;
  total_ventas_pvp: number;
  total_beneficio: number;
  margen: number;
  margen_anterior: number;
  margen_diferencia: number;
  porcentaje_en_ventas: number;
}

export interface InformeDetalladoVentasInterface {
  total: number;
  total_anterior: number;
  total_diferencia: number;
  beneficio_medio: number;
  beneficio_medio_anterior: number;
  beneficio_medio_diferencia: number;
}

export interface InformeDetalladoDataResult {
  marcas: InformeDetalladoMarcaInterface[];
  articulos: InformeDetalladoArticuloInterface[];
  ventas: InformeDetalladoVentasInterface;
}

export interface InformeDetalladoResult {
  status: string;
  data: InformeDetalladoDataResult;
}
