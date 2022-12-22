import { ArticuloTopVentaInterface } from "src/app/interfaces/venta.interface";
import { Utils } from "src/app/shared/utils.class";

export class ArticuloTopVenta {
  constructor(
    public localizador: number = null,
    public nombre: string = null,
    public importe: number = null
  ) {}

  fromInterface(tva: ArticuloTopVentaInterface): ArticuloTopVenta {
    this.localizador = tva.localizador;
    this.nombre = Utils.urldecode(tva.nombre);
    this.importe = tva.importe;

    return this;
  }

  toInterface(): ArticuloTopVentaInterface {
    return {
      localizador: this.localizador,
      nombre: Utils.urlencode(this.nombre),
      importe: this.importe,
    };
  }
}
