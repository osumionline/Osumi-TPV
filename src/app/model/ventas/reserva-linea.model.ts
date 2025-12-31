import { ReservaLineaInterface } from '@interfaces/cliente.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class ReservaLinea {
  constructor(
    public id: number | null = null,
    public idArticulo: number | null = null,
    public nombreArticulo: string | null = null,
    public localizador: number | null = null,
    public marca: string | null = null,
    public stock: number | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public iva: number | null = null,
    public importe: number | null = null,
    public descuento: number | null = null,
    public importeDescuento: number | null = null,
    public unidades: number | null = null
  ) {}

  get total(): number {
    return Math.floor((this.pvp ?? 0) * (this.unidades ?? 0) * 100) / 100;
  }

  fromInterface(rl: ReservaLineaInterface): ReservaLinea {
    this.id = rl.id;
    this.idArticulo = rl.idArticulo;
    this.nombreArticulo = urldecode(rl.nombreArticulo);
    this.localizador = rl.localizador;
    this.marca = urldecode(rl.marca);
    this.stock = rl.stock;
    this.puc = rl.puc;
    this.pvp = rl.pvp;
    this.iva = rl.iva;
    this.importe = rl.importe;
    this.descuento = rl.descuento;
    this.importeDescuento = rl.importeDescuento;
    this.unidades = rl.unidades;

    return this;
  }

  toInterface(): ReservaLineaInterface {
    return {
      id: this.id,
      idArticulo: this.idArticulo,
      nombreArticulo: urlencode(this.nombreArticulo),
      localizador: this.localizador,
      marca: urlencode(this.marca),
      stock: this.stock,
      puc: this.puc,
      pvp: this.pvp,
      iva: this.iva,
      importe: this.importe,
      descuento: this.descuento,
      importeDescuento: this.importeDescuento,
      unidades: this.unidades,
    };
  }
}
