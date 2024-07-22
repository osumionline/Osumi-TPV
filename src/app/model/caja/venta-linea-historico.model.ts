import { VentaLineaHistoricoInterface } from '@interfaces/caja.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class VentaLineaHistorico {
  devolver: number;

  constructor(
    public id: number = null,
    public idArticulo: number = null,
    public articulo: string = null,
    public localizador: number = null,
    public marca: string = null,
    public puc: number = null,
    public pvp: number = null,
    public iva: number = null,
    public re: number = null,
    public importe: number = null,
    public descuento: number = null,
    public importeDescuento: number = null,
    public devuelto: number = null,
    public unidades: number = null,
    public regalo: boolean = false
  ) {}

  get total(): number {
    return Math.floor(this.pvp * this.unidades * 100) / 100;
  }

  get totalDescuento(): number {
    if (this.descuento !== null && this.descuento !== 0) {
      return this.unidades * this.pvp * (this.descuento / 100);
    }
    if (this.importeDescuento !== null && this.importeDescuento !== 0) {
      return this.unidades * this.importeDescuento;
    }
    return 0;
  }

  fromInterface(hlv: VentaLineaHistoricoInterface): VentaLineaHistorico {
    this.id = hlv.id;
    this.idArticulo = hlv.idArticulo;
    this.articulo = urldecode(hlv.articulo);
    this.localizador = hlv.localizador;
    this.marca = urldecode(hlv.marca);
    this.puc = hlv.puc;
    this.pvp = hlv.pvp;
    this.iva = hlv.iva;
    this.re = hlv.re;
    this.importe = hlv.importe;
    this.descuento = hlv.descuento;
    this.importeDescuento = hlv.importeDescuento;
    this.devuelto = hlv.devuelto;
    this.unidades = hlv.unidades;
    this.devolver = hlv.unidades;
    this.regalo = hlv.regalo;

    return this;
  }

  toInterface(): VentaLineaHistoricoInterface {
    return {
      id: this.id,
      idArticulo: this.idArticulo,
      articulo: urlencode(this.articulo),
      localizador: this.localizador,
      marca: urlencode(this.marca),
      puc: this.puc,
      pvp: this.pvp,
      iva: this.iva,
      re: this.re,
      importe: this.importe,
      descuento: this.descuento,
      importeDescuento: this.importeDescuento,
      devuelto: this.devuelto,
      unidades: this.unidades,
      regalo: this.regalo,
    };
  }
}
