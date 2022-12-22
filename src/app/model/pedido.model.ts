import {
  PedidoInterface,
  PedidoLineaInterface,
  PedidoPDFInterface,
  PedidoVistaInterface,
  TotalsIVAOption,
} from "src/app/interfaces/pedido.interface";
import { IVAOption } from "src/app/model/iva-option.model";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { PedidoPDF } from "src/app/model/pedido-pdf.model";
import { PedidoVista } from "src/app/model/pedido-vista.model";
import { Utils } from "src/app/shared/utils.class";

export class Pedido {
  ivaOptions: IVAOption[] = [];

  constructor(
    public id: number = null,
    public idProveedor: number = -1,
    public proveedor: string = null,
    public idMetodoPago: number = null,
    public metodoPago: string = null,
    public re: boolean = false,
    public ue: boolean = false,
    public tipo: string = "albaran",
    public num: string = null,
    public fechaPago: string = null,
    public fechaPedido: string = null,
    public fechaRecepcionado: string = null,
    public lineas: PedidoLinea[] = [],
    public importe: number = null,
    public portes: number = 0,
    public faltas: boolean = false,
    public recepcionado: boolean = false,
    public observaciones: string = null,
    public pdfs: PedidoPDF[] = [],
    public vista: PedidoVista[] = []
  ) {}

  get nombreTipo(): string {
    if (this.tipo === null) {
      return null;
    }
    switch (this.tipo) {
      case "albaran":
        {
          return "Albarán";
        }
        break;
      case "factura":
        {
          return "Factura";
        }
        break;
      case "abono":
        {
          return "Abono";
        }
        break;
    }
  }

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

  get mediaMargen(): number {
    let pvp: number = 0;
    let puc: number = 0;

    for (let linea of this.lineas) {
      pvp += linea.pvp * linea.unidades;
      puc += linea.puc * linea.unidades;
    }
    puc += this.portes;
    return (100 * (pvp - puc)) / pvp;
  }

  get observacionesShort(): string {
    if (this.observaciones === null) {
      return null;
    }
    if (this.observaciones.length > 50) {
      return this.observaciones.substring(0, 50) + "...";
    }
    return this.observaciones;
  }

  updateUE(): void {
    for (let linea of this.lineas) {
      linea.ue = this.ue;
    }
  }

  fromInterface(p: PedidoInterface): Pedido {
    this.id = p.id;
    this.idProveedor = p.idProveedor;
    this.proveedor = Utils.urldecode(p.proveedor);
    this.idMetodoPago = p.idMetodoPago;
    this.metodoPago = Utils.urldecode(p.metodoPago);
    this.re = p.re;
    this.ue = p.ue;
    this.tipo = p.tipo;
    this.num = Utils.urldecode(p.num);
    this.fechaPago = Utils.urldecode(p.fechaPago);
    this.fechaPedido = Utils.urldecode(p.fechaPedido);
    this.fechaRecepcionado = Utils.urldecode(p.fechaRecepcionado);
    this.lineas = p.lineas.map((l: PedidoLineaInterface): PedidoLinea => {
      return new PedidoLinea().fromInterface(l);
    });
    this.importe = p.importe;
    this.portes = p.portes;
    this.faltas = p.faltas;
    this.recepcionado = p.recepcionado;
    this.observaciones = Utils.urldecode(p.observaciones);
    this.pdfs = p.pdfs.map((p: PedidoPDFInterface): PedidoPDF => {
      return new PedidoPDF().fromInterface(p);
    });
    this.vista = p.vista.map((pv: PedidoVistaInterface): PedidoVista => {
      return new PedidoVista().fromInterface(pv);
    });

    return this;
  }

  toInterface(): PedidoInterface {
    return {
      id: this.id,
      idProveedor: this.idProveedor,
      proveedor: Utils.urlencode(this.proveedor),
      idMetodoPago: this.idMetodoPago,
      metodoPago: Utils.urlencode(this.metodoPago),
      re: this.re,
      ue: this.ue,
      tipo: this.tipo,
      num: Utils.urlencode(this.num),
      fechaPago: Utils.urlencode(this.fechaPago),
      fechaPedido: Utils.urlencode(this.fechaPedido),
      fechaRecepcionado: Utils.urlencode(this.fechaRecepcionado),
      lineas: this.lineas.map((l: PedidoLinea): PedidoLineaInterface => {
        return l.toInterface();
      }),
      importe: this.importe,
      portes: this.portes,
      faltas: this.faltas,
      recepcionado: this.recepcionado,
      observaciones: Utils.urlencode(this.observaciones),
      pdfs: this.pdfs.map((p: PedidoPDF): PedidoPDFInterface => {
        return p.toInterface();
      }),
      vista: this.vista.map((pv: PedidoVista): PedidoVistaInterface => {
        return pv.toInterface();
      }),
    };
  }
}
