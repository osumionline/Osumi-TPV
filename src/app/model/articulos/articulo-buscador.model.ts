import { urldecode, urlencode } from "@osumi/tools";
import { ArticuloBuscadorInterface } from "src/app/interfaces/articulo.interface";

export class ArticuloBuscador {
  num: number = 0;

  constructor(
    public localizador: number = null,
    public nombre: string = null,
    public marca: string = null,
    public pvp: number = null,
    public stock: number = null
  ) {}

  fromInterface(ab: ArticuloBuscadorInterface): ArticuloBuscador {
    this.localizador = ab.localizador;
    this.nombre = urldecode(ab.nombre);
    this.marca = urldecode(ab.marca);
    this.pvp = ab.pvp;
    this.stock = ab.stock;

    return this;
  }

  toInterface(): ArticuloBuscadorInterface {
    return {
      localizador: this.localizador,
      nombre: urlencode(this.nombre),
      marca: urlencode(this.marca),
      pvp: this.pvp,
      stock: this.stock,
    };
  }
}
