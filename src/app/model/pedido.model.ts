import {
  PedidoInterface,
  PedidoLineaInterface,
} from "src/app/interfaces/interfaces";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { Utils } from "src/app/shared/utils.class";

export class Pedido {
  constructor(
    public id: number = null,
    public idProveedor: number = null,
    public proveedor: string = null,
    public re: boolean = false,
    public ue: boolean = false,
    public albaranFactura: string = "albaran",
    public numAlbaranFactura: string = null,
    public fechaPago: string = null,
    public fechaPedido: string = null,
    public lineas: PedidoLinea[] = [],
    public importe: number = null,
    public portes: number = null,
    public faltas: boolean = false,
    public recepcionado: boolean = null
  ) {}

  fromInterface(p: PedidoInterface): Pedido {
    this.id = p.id;
    this.idProveedor = p.idProveedor;
    this.proveedor = Utils.urldecode(p.proveedor);
    this.re = p.re;
    this.ue = p.ue;
    this.albaranFactura = p.albaranFactura;
    this.numAlbaranFactura = Utils.urldecode(p.numAlbaranFactura);
    this.fechaPago = Utils.urldecode(p.fechaPago);
    this.fechaPedido = Utils.urldecode(p.fechaPedido);
    this.lineas = p.lineas.map((l: PedidoLineaInterface): PedidoLinea => {
      return new PedidoLinea().fromInterface(l);
    });
    this.importe = p.importe;
    this.portes = p.portes;
    this.faltas = p.faltas;
    this.recepcionado = p.recepcionado;

    return this;
  }

  toInterface(): PedidoInterface {
    return {
      id: this.id,
      idProveedor: this.idProveedor,
      proveedor: Utils.urlencode(this.proveedor),
      re: this.re,
      ue: this.ue,
      albaranFactura: this.albaranFactura,
      numAlbaranFactura: Utils.urlencode(this.numAlbaranFactura),
      fechaPago: Utils.urlencode(this.fechaPago),
      fechaPedido: Utils.urlencode(this.fechaPedido),
      lineas: this.lineas.map((l: PedidoLinea): PedidoLineaInterface => {
        return l.toInterface();
      }),
      importe: this.importe,
      portes: this.portes,
      faltas: this.faltas,
      recepcionado: this.recepcionado,
    };
  }
}
