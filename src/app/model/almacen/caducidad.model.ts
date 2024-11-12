import { CaducidadInterface } from '@interfaces/caducidad.interface';
import Articulo from '@model/articulos/articulo.model';

export default class Caducidad {
  constructor(
    public id: number = null,
    public articulo: Articulo = null,
    public unidades: number = null,
    public pvp: number = null,
    public puc: number = null,
    public createdAt: string = null
  ) {}

  fromInterface(c: CaducidadInterface): Caducidad {
    this.id = c.id;
    this.articulo = new Articulo().fromInterface(c.articulo);
    this.unidades = c.unidades;
    this.pvp = c.pvp;
    this.puc = c.puc;
    this.createdAt = c.createdAt;

    return this;
  }

  toInterface(): CaducidadInterface {
    return {
      id: this.id,
      articulo: this.articulo.toInterface(),
      unidades: this.unidades,
      pvp: this.pvp,
      puc: this.puc,
      createdAt: this.createdAt,
    };
  }
}
