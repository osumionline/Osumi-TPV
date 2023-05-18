import { toNumber, urldecode, urlencode } from "@osumi/tools";
import {
  VentaFinInterface,
  VentaLineaInterface,
} from "src/app/interfaces/venta.interface";
import { VentaLinea } from "src/app/model/ventas/venta-linea.model";

export class VentaFin {
  pagoMixto: boolean = false;

  constructor(
    public efectivo: string = "0",
    public cambio: string = "0",
    public tarjeta: string = "0",
    public idEmpleado: number = null,
    public idTipoPago: number = null,
    public idCliente: number = null,
    public total: string = "0",
    public lineas: VentaLinea[] = [],
    public imprimir: string = "si",
    public email: string = null
  ) {}

  fromInterface(vf: VentaFinInterface): VentaFin {
    this.efectivo = vf.efectivo.toString();
    this.cambio = vf.cambio.toString();
    this.tarjeta = vf.tarjeta.toString();
    this.idEmpleado = vf.idEmpleado;
    this.idTipoPago = vf.idTipoPago;
    this.idCliente = vf.idCliente;
    this.total = vf.total.toString();
    this.lineas = vf.lineas.map((l: VentaLineaInterface): VentaLinea => {
      return new VentaLinea().fromInterface(l);
    });
    this.imprimir = urldecode(vf.imprimir);
    this.email = urldecode(vf.email);

    return this;
  }

  toInterface(): VentaFinInterface {
    return {
      efectivo: toNumber(this.efectivo),
      cambio: toNumber(this.cambio),
      tarjeta: toNumber(this.tarjeta),
      idEmpleado: this.idEmpleado,
      idTipoPago: this.idTipoPago,
      idCliente: this.idCliente,
      total: toNumber(this.total),
      lineas: this.lineas.map((l: VentaLinea): VentaLineaInterface => {
        return l.toInterface();
      }),
      pagoMixto: this.pagoMixto,
      imprimir: urlencode(this.imprimir),
      email: urlencode(this.email),
    };
  }
}
