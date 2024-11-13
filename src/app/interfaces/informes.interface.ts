export interface InformeMensualItemOtrosInterface {
  nombre: string;
  valor: number;
}

export interface InformeMensualItemInterface {
  num: number;
  weekDay: string;
  minTicket: number;
  maxTicket: number;
  efectivo: number;
  otros: InformeMensualItemOtrosInterface[];
  totalDia: number;
  suma: number;
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
