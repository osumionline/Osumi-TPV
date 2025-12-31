import { PedidoVistaInterface } from '@interfaces/pedido.interface';

export default class PedidoVista {
  constructor(public idColumn: number | null = null, public status: boolean = false) {}

  fromInterface(pv: PedidoVistaInterface): PedidoVista {
    this.idColumn = pv.idColumn;
    this.status = pv.status;

    return this;
  }

  toInterface(): PedidoVistaInterface {
    return {
      idColumn: this.idColumn,
      status: this.status,
    };
  }
}
