import {
  VentaFinInterface,
  VentaLineaInterface,
} from "src/app/interfaces/venta.interface";
import { VentaLinea } from "src/app/model/venta-linea.model";
import { Utils } from "src/app/shared/utils.class";

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
    public imprimir: string = "si"
  ) {}

  toInterface(): VentaFinInterface {
    const lineas: VentaLineaInterface[] = [];
    for (let linea of this.lineas) {
      lineas.push(linea.toInterface());
    }
    return {
      efectivo: Utils.toNumber(this.efectivo),
      cambio: Utils.toNumber(this.cambio),
      tarjeta: Utils.toNumber(this.tarjeta),
      idEmpleado: this.idEmpleado,
      idTipoPago: this.idTipoPago,
      idCliente: this.idCliente,
      total: Utils.toNumber(this.total),
      lineas: lineas,
      pagoMixto: this.pagoMixto,
      imprimir: Utils.urlencode(this.imprimir),
    };
  }
}
