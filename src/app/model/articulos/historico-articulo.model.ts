import { HistoricoArticuloInterface } from '@interfaces/articulo.interface';

export default class HistoricoArticulo {
  constructor(
    public id: number = null,
    public tipo: number = null,
    public stockPrevio: number = null,
    public diferencia: number = null,
    public stockFinal: number = null,
    public idVenta: number = null,
    public idPedido: number = null,
    public puc: number = null,
    public pvp: number = null,
    public createdAt: string = null
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
