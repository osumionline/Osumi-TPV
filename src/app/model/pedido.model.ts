import {
  PedidoInterface,
  PedidoLineaInterface,
  TotalsIVAOption,
} from "src/app/interfaces/interfaces";
import { IVAOption } from "src/app/model/iva-option.model";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { PedidoPDF } from "src/app/model/pedido-pdf.model";
import { Utils } from "src/app/shared/utils.class";
import { PedidoPDFInterface } from "./../interfaces/interfaces";

export class Pedido {
  ivaOptions: IVAOption[] = [];

  constructor(
    public id: number = null,
    public idProveedor: number = -1,
    public proveedor: string = null,
    public re: boolean = false,
    public ue: boolean = false,
    public albaranFactura: string = "albaran",
    public numAlbaranFactura: string = null,
    public fechaPago: string = null,
    public fechaPedido: string = null,
    public lineas: PedidoLinea[] = [],
    public importe: number = null,
    public portes: number = 0,
    public faltas: boolean = false,
    public recepcionado: boolean = false,
    public pdfs: PedidoPDF[] = []
  ) {}

  get totalArticulos(): number {
    let num: number = 0;
    for (let linea of this.lineas) {
      num += linea.unidades;
    }
    return num;
  }

  get totalBeneficios(): number {
    let num: number = 0;
    for (let linea of this.lineas) {
      num += linea.beneficio;
    }
    return num;
  }

  get totalPVP(): number {
    let num: number = 0;
    for (let linea of this.lineas) {
      num += linea.unidades * linea.pvp;
    }
    return num;
  }

  get subtotal(): number {
    let num: number = 0;
    for (let linea of this.lineas) {
      num += linea.unidades * linea.subtotal;
    }
    return num;
  }

  get total(): number {
    let num: number = 0;
    for (let linea of this.lineas) {
      num += linea.unidades * linea.total;
    }
    return num;
  }

  get ivaList(): TotalsIVAOption[] {
    const list = {};

    for (let linea of this.lineas) {
      if (!list.hasOwnProperty("iva_" + linea.iva)) {
        list["iva_" + linea.iva] = 0;
      }
      list["iva_" + linea.iva] +=
        linea.unidades * (linea.palb * (1 + linea.iva / 100) - linea.palb);
      if (linea.selectedIvaOption.tipoIVA === "re") {
        if (!list.hasOwnProperty("re_" + linea.re)) {
          list["re_" + linea.re] = 0;
        }
        list["re_" + linea.re] +=
          linea.unidades * (linea.palb * (1 + linea.re / 100) - linea.palb);
      }
    }

    const ret: TotalsIVAOption[] = [];
    for (let ivaOption of this.ivaOptions) {
      ret.push({
        tipoIva: ivaOption.tipoIVA,
        ivaOption: ivaOption.iva,
        iva: list["iva_" + ivaOption.iva],
        reOption: ivaOption.re,
        re: list["re_" + ivaOption.re],
      });
    }

    return ret;
  }

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
    this.pdfs = p.pdfs.map((p: PedidoPDFInterface): PedidoPDF => {
      return new PedidoPDF().fromInterface(p);
    });

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
      pdfs: this.pdfs.map((p: PedidoPDF): PedidoPDFInterface => {
        return p.toInterface();
      }),
    };
  }
}
