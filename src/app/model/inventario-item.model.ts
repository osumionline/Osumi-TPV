import { InventarioItemInterface } from "src/app/interfaces/almacen.interface";
import { Utils } from "src/app/shared/utils.class";

export class InventarioItem {
  _stock: number = null;
  _pvp: number = null;
  codigoBarras: string = null;

  constructor(
    public id: number = null,
    public localizador: number = null,
    public marca: string = null,
    public proveedor: string = null,
    public referencia: string = null,
    public nombre: string = null,
    public stock: number = null,
    public puc: number = null,
    public pvp: number = null,
    public hasCodigosBarras: boolean = false,
    public observaciones: string = null
  ) {
    this._stock = stock;
    this._pvp = pvp;
  }

  get stockChanged(): boolean {
    return this._stock !== this.stock;
  }

  get pvpChanged(): boolean {
    return this._pvp !== this.pvp;
  }

  get margen(): number {
    if (this.pvp === 0) {
      return 0;
    }
    return (100 * (this.pvp - this.puc)) / this.pvp;
  }

  fromInterface(ii: InventarioItemInterface): InventarioItem {
    this.id = ii.id;
    this.localizador = ii.localizador;
    this.marca = Utils.urldecode(ii.marca);
    this.proveedor =
      ii.proveedor !== null ? Utils.urldecode(ii.proveedor) : null;
    this.referencia = Utils.urldecode(ii.referencia);
    this.nombre = Utils.urldecode(ii.nombre);
    this.stock = ii.stock;
    this._stock = ii.stock;
    this.puc = ii.puc;
    this.pvp = ii.pvp;
    this._pvp = ii.pvp;
    this.hasCodigosBarras = ii.hasCodigosBarras;
    this.observaciones = Utils.urldecode(ii.observaciones);

    return this;
  }

  toInterface(): InventarioItemInterface {
    return {
      id: this.id,
      localizador: this.localizador,
      marca: Utils.urlencode(this.marca),
      proveedor:
        this.proveedor !== null ? Utils.urlencode(this.proveedor) : null,
      referencia: Utils.urlencode(this.referencia),
      nombre: Utils.urlencode(this.nombre),
      stock: this.stock,
      puc: this.puc,
      pvp: this.pvp,
      hasCodigosBarras: this.hasCodigosBarras,
      codigoBarras: this.codigoBarras,
      observaciones: Utils.urlencode(this.observaciones),
    };
  }
}
