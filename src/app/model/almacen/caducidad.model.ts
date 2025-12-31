import { CaducidadInterface } from '@interfaces/caducidad.interface';
import Articulo from '@model/articulos/articulo.model';

export default class Caducidad {
  constructor(
    public id: number | null = null,
    public articulo: Articulo | null = null,
    public unidades: number | null = null,
    public pvp: number | null = null,
    public puc: number | null = null,
    public createdAt: string | null = null
  ) {}

  fromInterface(c: CaducidadInterface): Caducidad {
    this.id = c.id;
    this.articulo = c.articulo !== null ? new Articulo().fromInterface(c.articulo) : null;
    this.unidades = c.unidades;
    this.pvp = c.pvp;
    this.puc = c.puc;
    this.createdAt = c.createdAt;

    return this;
  }

  toInterface(): CaducidadInterface {
    return {
      id: this.id,
      articulo: this.articulo !== null ? this.articulo.toInterface() : null,
      unidades: this.unidades,
      pvp: this.pvp,
      puc: this.puc,
      createdAt: this.createdAt,
    };
  }
}
