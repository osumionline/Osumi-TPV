import { ArticuloUltimaVentaInterface } from "@interfaces/venta.interface";
import { urldecode, urlencode } from "@osumi/tools";

export class ArticuloUltimaVenta {
  constructor(
    public fecha: string = null,
    public localizador: number = null,
    public nombre: string = null,
    public unidades: number = null,
    public pvp: number = null,
    public importe: number = null
  ) {}

  fromInterface(uva: ArticuloUltimaVentaInterface): ArticuloUltimaVenta {
    this.fecha = uva.fecha;
    this.localizador = uva.localizador;
    this.nombre = urldecode(uva.nombre);
    this.unidades = uva.unidades;
    this.pvp = uva.pvp;
    this.importe = uva.importe;

    return this;
  }

  toInterface(): ArticuloUltimaVentaInterface {
    return {
      fecha: this.fecha,
      localizador: this.localizador,
      nombre: urlencode(this.nombre),
      unidades: this.unidades,
      pvp: this.pvp,
      importe: this.importe,
    };
  }
}
