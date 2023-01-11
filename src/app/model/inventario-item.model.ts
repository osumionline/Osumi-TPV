import { InventarioItemInterface } from "src/app/interfaces/almacen.interface";
import { Utils } from "src/app/shared/utils.class";

export class InventarioItem {
  _stock: number = null;
  _pvp: number = null;

  constructor(
    public id: number = null,
    public localizador: number = null,
    public marca: string = null,
    public referencia: string = null,
    public nombre: string = null,
    public stock: number = null,
    public puc: number = null,
    public pvp: number = null
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
    this.referencia = Utils.urldecode(ii.referencia);
    this.nombre = Utils.urldecode(ii.nombre);
    this.stock = ii.stock;
    this._stock = ii.stock;
    this.puc = ii.puc;
    this.pvp = ii.pvp;
    this._pvp = ii.pvp;

    return this;
  }

  toInterface(): InventarioItemInterface {
    return {
      id: this.id,
      localizador: this.localizador,
      marca: Utils.urlencode(this.marca),
      referencia: Utils.urlencode(this.referencia),
      nombre: Utils.urlencode(this.nombre),
      stock: this.stock,
      puc: this.puc,
      pvp: this.pvp,
    };
  }
}
