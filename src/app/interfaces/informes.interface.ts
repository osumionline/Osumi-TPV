export interface InformeMensualItemOtrosInterface {
  nombre: string;
  valor: number;
}

export interface InformeMensualItemInterface {
  num: number;
  weekDay: "S%C3%A1bado";
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
