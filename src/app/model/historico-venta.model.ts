import {
  HistoricoLineaVentaInterface,
  HistoricoVentaInterface,
} from "src/app/interfaces/interfaces";
import { HistoricoLineaVenta } from "src/app/model/historico-linea-venta.model";
import { Utils } from "src/app/shared/utils.class";

export class HistoricoVenta {
  constructor(
    public id: number = null,
    public editable: boolean = false,
    public idEmpleado: number = null,
    public idCliente: number = null,
    public cliente: string = null,
    public total: number = null,
    public entregado: number = null,
    public pagoMixto: boolean = false,
    public idTipoPago: number = null,
    public nombreTipoPago: string = null,
    public entregadoOtro: number = null,
    public saldo: number = null,
    public fecha: string = null,
    public lineas: HistoricoLineaVenta[] = []
  ) {}

  fromInterface(hv: HistoricoVentaInterface): HistoricoVenta {
    this.id = hv.id;
    this.editable = hv.editable;
    this.idEmpleado = hv.idEmpleado;
    this.idCliente = hv.idCliente;
    this.cliente = hv.cliente !== null ? Utils.urldecode(hv.cliente) : null;
    this.total = hv.total;
    this.entregado = hv.entregado;
    this.pagoMixto = hv.pagoMixto;
    this.idTipoPago = hv.idTipoPago;
    this.nombreTipoPago = Utils.urldecode(hv.nombreTipoPago);
    this.entregadoOtro = hv.entregadoOtro;
    this.saldo = hv.saldo;
    this.fecha = Utils.urldecode(hv.fecha);
    this.lineas = hv.lineas.map(
      (hlv: HistoricoLineaVentaInterface): HistoricoLineaVenta => {
        return new HistoricoLineaVenta().fromInterface(hlv);
      }
    );

    return this;
  }

  toInterface(): HistoricoVentaInterface {
    return {
      id: this.id,
      editable: this.editable,
      idEmpleado: this.idEmpleado,
      idCliente: this.idCliente,
      cliente: Utils.urlencode(this.cliente),
      total: this.total,
      entregado: this.entregado,
      pagoMixto: this.pagoMixto,
      idTipoPago: this.idTipoPago,
      nombreTipoPago: Utils.urlencode(this.nombreTipoPago),
      entregadoOtro: this.entregadoOtro,
      saldo: this.saldo,
      fecha: Utils.urlencode(this.fecha),
      lineas: this.lineas.map(
        (hlv: HistoricoLineaVenta): HistoricoLineaVentaInterface => {
          return hlv.toInterface();
        }
      ),
    };
  }
}
