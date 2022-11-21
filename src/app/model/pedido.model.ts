import { PedidoInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class Pedido {
  constructor(
    public id: number = null,
    public idProveedor: number = null,
    public proveedor: string = null,
    public albaran: string = null,
    public importe: number = null,
    public recepcionado: boolean = null,
    public fecha: string = null
  ) {}

  fromInterface(p: PedidoInterface): Pedido {
    this.id = p.id;
    this.idProveedor = p.idProveedor;
    this.proveedor = Utils.urldecode(p.proveedor);
    this.albaran = Utils.urldecode(p.albaran);
    this.importe = p.importe;
    this.recepcionado = p.recepcionado;
    this.fecha = p.fecha;

    return this;
  }

  toInterface(): PedidoInterface {
    return {
      id: this.id,
      idProveedor: this.idProveedor,
      proveedor: Utils.urlencode(this.proveedor),
      albaran: Utils.urlencode(this.albaran),
      importe: this.importe,
      recepcionado: this.recepcionado,
      fecha: this.fecha,
    };
  }
}
