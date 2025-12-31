export interface TipoPagoInterface {
  id: number | null;
  nombre: string | null;
  foto: string | null;
  afectaCaja: boolean;
  orden: number | null;
  fisico: boolean;
}

export interface TiposPagoResult {
  list: TipoPagoInterface[];
}

export interface TiposPagoOrderInterface {
  id: number;
  orden: number;
}
