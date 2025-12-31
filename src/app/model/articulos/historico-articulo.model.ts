import { HistoricoArticuloInterface } from '@interfaces/articulo.interface';

export default class HistoricoArticulo {
  constructor(
    public id: number | null = null,
    public tipo: number | null = null,
    public stockPrevio: number | null = null,
    public diferencia: number | null = null,
    public stockFinal: number | null = null,
    public idVenta: number | null = null,
    public idPedido: number | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public createdAt: string | null = null
  ) {}

  fromInterface(ha: HistoricoArticuloInterface): HistoricoArticulo {
    this.id = ha.id;
    this.tipo = ha.tipo;
    this.stockPrevio = ha.stockPrevio;
    this.diferencia = ha.diferencia;
    this.stockFinal = ha.stockFinal;
    this.idVenta = ha.idVenta;
    this.idPedido = ha.idPedido;
    this.puc = ha.puc;
    this.pvp = ha.pvp;
    this.createdAt = ha.createdAt;

    return this;
  }

  toInterface(): HistoricoArticuloInterface {
    return {
      id: this.id,
      tipo: this.tipo,
      stockPrevio: this.stockPrevio,
      diferencia: this.diferencia,
      stockFinal: this.stockPrevio,
      idVenta: this.idVenta,
      idPedido: this.idPedido,
      puc: this.puc,
      pvp: this.pvp,
      createdAt: this.createdAt,
    };
  }
}
