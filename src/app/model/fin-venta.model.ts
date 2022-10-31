import {
  FinVentaInterface,
  LineaVentaInterface,
} from "src/app/interfaces/interfaces";
import { LineaVenta } from "src/app/model/linea-venta.model";
import { Utils } from "src/app/shared/utils.class";

export class FinVenta {
  pagoMixto: boolean = false;
  factura: boolean = false;

  constructor(
    public efectivo: string = "0",
    public cambio: string = "0",
    public tarjeta: string = "0",
    public idEmpleado: number = null,
    public idTipoPago: number = null,
    public idCliente: number = null,
    public total: string = "0",
    public lineas: LineaVenta[] = []
  ) {}

  toInterface(): FinVentaInterface {
    const lineas: LineaVentaInterface[] = [];
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
      factura: this.factura,
    };
  }
}
