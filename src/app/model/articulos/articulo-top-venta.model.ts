import { ArticuloTopVentaInterface } from '@interfaces/venta.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class ArticuloTopVenta {
  constructor(
    public localizador: number | null = null,
    public nombre: string | null = null,
    public importe: number | null = null,
    public unidades: number | null = null
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
