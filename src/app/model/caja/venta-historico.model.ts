import { urldecode, urlencode } from "@osumi/tools";
import {
  VentaHistoricoInterface,
  VentaLineaHistoricoInterface,
} from "src/app/interfaces/caja.interface";
import { VentaLineaHistorico } from "src/app/model/caja/venta-linea-historico.model";

export class VentaHistorico {
  _totalUnidades: number = null;
  _totalDescuento: number = null;

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
    public facturada: boolean = false,
    public statusFactura: string = null,
    public fecha: string = null,
    public lineas: VentaLineaHistorico[] = []
  ) {}

  get totalUnidades(): number {
    if (this._totalUnidades !== null) {
      return this._totalUnidades;
    }
    let unidades: number = 0;

    for (let linea of this.lineas) {
      unidades += linea.unidades;
    }

    this._totalUnidades = unidades;

    return this._totalUnidades;
  }

  get totalDescuento(): number {
    if (this._totalDescuento !== null) {
      return this._totalDescuento;
    }
    let descuento: number = 0;

    for (let linea of this.lineas) {
      if (linea.importeDescuento) {
        descuento += linea.importeDescuento;
      } else {
        if (linea.descuento !== 0) {
          descuento += linea.total * (linea.descuento / 100);
        }
      }
    }

    this._totalDescuento = descuento;

    return this._totalDescuento;
  }

  get tipoPago(): number {
    if (this.idTipoPago === null) {
      return -1;
    }
    return this.idTipoPago;
  }

  set tipoPago(tp: number) {
    if (tp === -1) {
      this.idTipoPago = null;
    }
    this.idTipoPago = tp;
  }

  fromInterface(hv: VentaHistoricoInterface): VentaHistorico {
    this.id = hv.id;
    this.editable = hv.editable;
    this.idEmpleado = hv.idEmpleado;
    this.idCliente = hv.idCliente;
    this.cliente = hv.cliente !== null ? urldecode(hv.cliente) : null;
    this.total = hv.total;
    this.entregado = hv.entregado;
    this.pagoMixto = hv.pagoMixto;
    this.idTipoPago = hv.idTipoPago;
    this.nombreTipoPago = urldecode(hv.nombreTipoPago);
    this.entregadoOtro = hv.entregadoOtro;
    this.saldo = hv.saldo;
    this.facturada = hv.facturada;
    this.statusFactura = hv.statusFactura;
    this.fecha = urldecode(hv.fecha);
    this.lineas = hv.lineas.map(
      (hlv: VentaLineaHistoricoInterface): VentaLineaHistorico => {
        return new VentaLineaHistorico().fromInterface(hlv);
      }
    );

    return this;
  }

  toInterface(): VentaHistoricoInterface {
    return {
      id: this.id,
      editable: this.editable,
      idEmpleado: this.idEmpleado,
      idCliente: this.idCliente,
      cliente: urlencode(this.cliente),
      total: this.total,
      entregado: this.entregado,
      pagoMixto: this.pagoMixto,
      idTipoPago: this.idTipoPago,
      nombreTipoPago: urlencode(this.nombreTipoPago),
      entregadoOtro: this.entregadoOtro,
      saldo: this.saldo,
      facturada: this.facturada,
      statusFactura: this.statusFactura,
      fecha: urlencode(this.fecha),
      lineas: this.lineas.map(
        (hlv: VentaLineaHistorico): VentaLineaHistoricoInterface => {
          return hlv.toInterface();
        }
      ),
    };
  }
}
