import { TopVentaArticuloInterface } from "src/app/interfaces/venta.interface";
import { Utils } from "src/app/shared/utils.class";

export class TopVentaArticulo {
  constructor(
    public localizador: number = null,
    public nombre: string = null,
    public importe: number = null
  ) {}

  fromInterface(tva: TopVentaArticuloInterface): TopVentaArticulo {
    this.localizador = tva.localizador;
    this.nombre = Utils.urldecode(tva.nombre);
    this.importe = tva.importe;

    return this;
  }

  toInterface(): TopVentaArticuloInterface {
    return {
      localizador: this.localizador,
      nombre: Utils.urlencode(this.nombre),
      importe: this.importe,
    };
  }
}
