import { urldecode, urlencode } from "@osumi/tools";
import { ArticuloTopVentaInterface } from "src/app/interfaces/venta.interface";

export class ArticuloTopVenta {
  constructor(
    public localizador: number = null,
    public nombre: string = null,
    public importe: number = null,
    public unidades: number = null
  ) {}

  fromInterface(tva: ArticuloTopVentaInterface): ArticuloTopVenta {
    this.localizador = tva.localizador;
    this.nombre = urldecode(tva.nombre);
    this.importe = tva.importe;
    this.unidades = tva.unidades;

    return this;
  }

  toInterface(): ArticuloTopVentaInterface {
    return {
      localizador: this.localizador,
      nombre: urlencode(this.nombre),
      importe: this.importe,
      unidades: this.unidades,
    };
  }
}
