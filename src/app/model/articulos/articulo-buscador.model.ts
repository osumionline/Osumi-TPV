import { ArticuloBuscadorInterface } from "src/app/interfaces/articulo.interface";
import { Utils } from "src/app/shared/utils.class";

export class ArticuloBuscador {
  constructor(
    public localizador: number = null,
    public nombre: string = null,
    public marca: string = null,
    public pvp: number = null,
    public stock: number = null
  ) {}

  fromInterface(ab: ArticuloBuscadorInterface): ArticuloBuscador {
    this.localizador = ab.localizador;
    this.nombre = Utils.urldecode(ab.nombre);
    this.marca = Utils.urldecode(ab.marca);
    this.pvp = ab.pvp;
    this.stock = ab.stock;

    return this;
  }

  toInterface(): ArticuloBuscadorInterface {
    return {
      localizador: this.localizador,
      nombre: Utils.urlencode(this.nombre),
      marca: Utils.urlencode(this.marca),
      pvp: this.pvp,
      stock: this.stock,
    };
  }
}
