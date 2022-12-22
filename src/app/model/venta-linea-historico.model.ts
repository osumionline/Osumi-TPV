import { VentaLineaHistoricoInterface } from "src/app/interfaces/caja.interface";
import { Utils } from "src/app/shared/utils.class";

export class VentaLineaHistorico {
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
    public unidades: number = null
  ) {}

  get total(): number {
    return this.pvp * this.unidades;
  }

  fromInterface(hlv: VentaLineaHistoricoInterface): VentaLineaHistorico {
    this.id = hlv.id;
    this.idArticulo = hlv.idArticulo;
    this.articulo = Utils.urldecode(hlv.articulo);
    this.localizador = hlv.localizador;
    this.marca = Utils.urldecode(hlv.marca);
    this.puc = hlv.puc;
    this.pvp = hlv.pvp;
    this.iva = hlv.iva;
    this.re = hlv.re;
    this.importe = hlv.importe;
    this.descuento = hlv.descuento;
    this.importeDescuento = hlv.importeDescuento;
    this.devuelto = hlv.devuelto;
    this.unidades = hlv.unidades;

    return this;
  }

  toInterface(): VentaLineaHistoricoInterface {
    return {
      id: this.id,
      idArticulo: this.idArticulo,
      articulo: Utils.urlencode(this.articulo),
      localizador: this.localizador,
      marca: Utils.urlencode(this.marca),
      puc: this.puc,
      pvp: this.pvp,
      iva: this.iva,
      re: this.re,
      importe: this.importe,
      descuento: this.descuento,
      importeDescuento: this.importeDescuento,
      devuelto: this.devuelto,
      unidades: this.unidades,
    };
  }
}
