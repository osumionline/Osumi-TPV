import { ArticuloUltimaVentaInterface } from "src/app/interfaces/venta.interface";
import { Utils } from "src/app/modules/shared/utils.class";

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
    this.nombre = Utils.urldecode(uva.nombre);
    this.unidades = uva.unidades;
    this.pvp = uva.pvp;
    this.importe = uva.importe;

    return this;
  }

  toInterface(): ArticuloUltimaVentaInterface {
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
