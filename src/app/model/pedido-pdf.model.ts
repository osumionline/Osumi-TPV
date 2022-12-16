import { PedidoPDFInterface } from "src/app/interfaces/pedido.interface";
import { Utils } from "src/app/shared/utils.class";

export class PedidoPDF {
  constructor(
    public id: number = null,
    public data: string = null,
    public nombre: string = null
  ) {}

  fromInterface(p: PedidoPDFInterface): PedidoPDF {
    this.id = p.id;
    this.data = p.data;
    this.nombre = Utils.urldecode(p.nombre);

    return this;
  }

  toInterface(): PedidoPDFInterface {
    return {
      id: this.id,
      data: this.data,
      nombre: Utils.urlencode(this.nombre),
    };
  }
}
