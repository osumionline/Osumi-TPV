import {
  PedidoInterface,
  PedidoLineaInterface,
  PedidoPDFInterface,
  PedidoVistaInterface,
  TotalsIVAOption,
} from '@interfaces/pedido.interface';
import PedidoLinea from '@model/compras/pedido-linea.model';
import PedidoPDF from '@model/compras/pedido-pdf.model';
import PedidoVista from '@model/compras/pedido-vista.model';
import IVAOption from '@model/tpv/iva-option.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Pedido {
  ivaOptions: IVAOption[] = [];
  _descuento: number = 0;

  constructor(
    public id: number = null,
    public idProveedor: number = -1,
    public proveedor: string = null,
    public idMetodoPago: number = null,
    public metodoPago: string = null,
    public re: boolean = false,
    public ue: boolean = false,
    public tipo: string = 'albaran',
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

  get descuento(): number {
    return this._descuento;
  }

  set descuento(x: number) {
    this._descuento = x;
    for (const i in this.lineas) {
      this.lineas[i].descuentoPedido = x;
    }
  }

  get nombreTipo(): string {
    if (this.tipo === null) {
      return null;
    }
    switch (this.tipo) {
      case 'albaran':
        {
          return 'Albarán';
        }
        break;
      case 'factura':
        {
          return 'Factura';
        }
        break;
      case 'abono':
        {
          return 'Abono';
        }
        break;
    }
  }

  get totalArticulos(): number {
    let num: number = 0;
    for (const linea of this.lineas) {
      num += linea.unidades;
    }
    return num;
  }

  get totalBeneficios(): number {
    let num: number = 0;
    for (const linea of this.lineas) {
      num += linea.beneficio;
    }
    return num;
  }

  get totalPVP(): number {
    let num: number = 0;
    for (const linea of this.lineas) {
      num += linea.unidades * linea.pvp;
    }
    return num;
  }

  get subtotal(): number {
    let num: number = 0;
    for (const linea of this.lineas) {
      num += linea.subtotal;
    }
    return num + this.portes;
  }

  get total(): number {
    let totalIVA: number = 0;
    for (const lineaIVA of this.ivaList) {
      if (lineaIVA.iva !== undefined) {
        totalIVA += lineaIVA.iva;
      }
      if (lineaIVA.re !== undefined) {
        totalIVA += lineaIVA.re;
      }
    }
    return this.subtotal + totalIVA;
  }

  get ivaList(): TotalsIVAOption[] {
    const list = {};

    for (const linea of this.lineas) {
      if (!Object.prototype.hasOwnProperty.call(list, 'iva_' + linea.iva)) {
        list['iva_' + linea.iva] = 0;
      }
      list['iva_' + linea.iva] +=
        linea.subtotal * (1 + linea.iva / 100) - linea.subtotal;
      if (this.re) {
        if (!Object.prototype.hasOwnProperty.call(list, 're_' + linea.re)) {
          list['re_' + linea.re] = 0;
        }
        list['re_' + linea.re] +=
          linea.subtotal * (1 + linea.re / 100) - linea.subtotal;
      }
    }

    if (this.portes !== null && this.portes > 0) {
      if (!Object.prototype.hasOwnProperty.call(list, 'iva_21')) {
        list['iva_21'] = 0;
      }
      list['iva_21'] += this.portes * 0.21;
      if (this.re) {
        if (!Object.prototype.hasOwnProperty.call(list, 're_5.2')) {
          list['re_5.2'] = 0;
        }
        list['re_5.2'] += this.portes * 0.052;
      }
    }

    const ret: TotalsIVAOption[] = [];
    for (const ivaOption of this.ivaOptions) {
      ret.push({
        tipoIva: ivaOption.tipoIVA,
        ivaOption: ivaOption.iva,
        iva: list['iva_' + ivaOption.iva],
        reOption: ivaOption.re,
        re: list['re_' + ivaOption.re],
      });
    }

    return ret;
  }

  get mediaMargen(): number {
    let pvp: number = 0;
    let puc: number = 0;

    for (const linea of this.lineas) {
      pvp += linea.pvp * linea.unidades;
      puc += linea.puc * linea.unidades;
    }
    puc += this.portes;
    if (pvp === 0) {
      return 0;
    }
    return (100 * (pvp - puc)) / pvp;
  }

  get observacionesShort(): string {
    if (this.observaciones === null) {
      return null;
    }
    if (this.observaciones.length > 50) {
      return this.observaciones.substring(0, 50) + '...';
    }
    return this.observaciones;
  }

  fromInterface(p: PedidoInterface): Pedido {
    this.id = p.id;
    this.idProveedor = p.idProveedor;
    this.proveedor = urldecode(p.proveedor);
    this.idMetodoPago = p.idMetodoPago;
    this.metodoPago = urldecode(p.metodoPago);
    this.re = p.re;
    this.ue = p.ue;
    this.tipo = p.tipo;
    this.num = urldecode(p.num);
    this.fechaPago = urldecode(p.fechaPago);
    this.fechaPedido = urldecode(p.fechaPedido);
    this.fechaRecepcionado = urldecode(p.fechaRecepcionado);
    this.lineas = p.lineas.map((l: PedidoLineaInterface): PedidoLinea => {
      return new PedidoLinea().fromInterface(l);
    });
    this.importe = p.importe;
    this.portes = p.portes;
    this.descuento = p.descuento;
    this.faltas = p.faltas;
    this.recepcionado = p.recepcionado;
    this.observaciones = urldecode(p.observaciones);
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
      proveedor: urlencode(this.proveedor),
      idMetodoPago: this.idMetodoPago,
      metodoPago: urlencode(this.metodoPago),
      re: this.re,
      ue: this.ue,
      tipo: this.tipo,
      num: urlencode(this.num),
      fechaPago: urlencode(this.fechaPago),
      fechaPedido: urlencode(this.fechaPedido),
      fechaRecepcionado: urlencode(this.fechaRecepcionado),
      lineas: this.lineas.map((l: PedidoLinea): PedidoLineaInterface => {
        return l.toInterface();
      }),
      importe: this.importe,
      portes: this.portes,
      descuento: this._descuento,
      faltas: this.faltas,
      recepcionado: this.recepcionado,
      observaciones: urlencode(this.observaciones),
      pdfs: this.pdfs.map((p: PedidoPDF): PedidoPDFInterface => {
        return p.toInterface();
      }),
      vista: this.vista.map((pv: PedidoVista): PedidoVistaInterface => {
        return pv.toInterface();
      }),
    };
  }
}
