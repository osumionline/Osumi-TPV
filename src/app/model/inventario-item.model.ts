import { InventarioItemInterface } from "src/app/interfaces/almacen.interface";
import { Utils } from "src/app/shared/utils.class";

export class InventarioItem {
  constructor(
    public idArticulo: number = null,
    public localizador: number = null,
    public marca: string = null,
    public referencia: string = null,
    public nombre: string = null,
    public stock: number = null,
    public pvp: number = null,
    public margen: number = null
  ) {}

  fromInterface(ii: InventarioItemInterface): InventarioItem {
    this.idArticulo = ii.idArticulo;
    this.localizador = ii.localizador;
    this.marca = Utils.urldecode(ii.marca);
    this.referencia = Utils.urldecode(ii.referencia);
    this.nombre = Utils.urldecode(ii.nombre);
    this.stock = ii.stock;
    this.pvp = ii.pvp;
    this.margen = ii.margen;

    return this;
  }

  toInterface(): InventarioItemInterface {
    return {
      idArticulo: this.idArticulo,
      localizador: this.localizador,
      marca: Utils.urlencode(this.marca),
      referencia: Utils.urlencode(this.referencia),
      nombre: Utils.urlencode(this.nombre),
      stock: this.stock,
      pvp: this.pvp,
      margen: this.margen,
    };
  }
}
