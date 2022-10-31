import { UltimaVentaArticuloInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class UltimaVentaArticulo {
  constructor(
    public fecha: string = null,
    public localizador: number = null,
    public nombre: string = null,
    public unidades: number = null,
    public pvp: number = null,
    public importe: number = null
  ) {}

  fromInterface(uva: UltimaVentaArticuloInterface): UltimaVentaArticulo {
    this.fecha = uva.fecha;
    this.localizador = uva.localizador;
    this.nombre = Utils.urldecode(uva.nombre);
    this.unidades = uva.unidades;
    this.pvp = uva.pvp;
    this.importe = uva.importe;

    return this;
  }

  toInterface(): UltimaVentaArticuloInterface {
    return {
      fecha: this.fecha,
      localizador: this.localizador,
      nombre: Utils.urlencode(this.nombre),
      unidades: this.unidades,
      pvp: this.pvp,
      importe: this.importe,
    };
  }
}
