export interface TipoPagoInterface {
  id: number;
  nombre: string;
  foto: string;
  afectaCaja: boolean;
  orden: number;
  fisico: boolean;
}

export interface TiposPagoResult {
  list: TipoPagoInterface[];
}

export interface TiposPagoOrderInterface {
  id: number;
  orden: number;
}
