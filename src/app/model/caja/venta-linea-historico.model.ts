import { VentaLineaHistoricoInterface } from '@interfaces/caja.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class VentaLineaHistorico {
  devolver: number | null = null;

  constructor(
    public id: number | null = null,
    public idArticulo: number | null = null,
    public articulo: string | null = null,
    public localizador: number | null = null,
    public marca: string | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public iva: number | null = null,
    public re: number | null = null,
    public importe: number | null = null,
    public descuento: number | null = null,
    public importeDescuento: number | null = null,
    public devuelto: number | null = null,
    public unidades: number | null = null,
    public regalo: boolean = false
  ) {}

  get total(): number {
    return Math.floor((this.pvp ?? 0) * (this.unidades ?? 0) * 100) / 100;
  }

  get totalDescuento(): number {
    if (this.descuento !== null && this.descuento !== 0) {
      return (this.unidades ?? 0) * (this.pvp ?? 0) * (this.descuento / 100);
    }
    if (this.importeDescuento !== null && this.importeDescuento !== 0) {
      return (this.unidades ?? 0) * this.importeDescuento;
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
