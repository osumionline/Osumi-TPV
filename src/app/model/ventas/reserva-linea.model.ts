import { ReservaLineaInterface } from '@interfaces/cliente.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class ReservaLinea {
  constructor(
    public id: number = null,
    public idArticulo: number = null,
    public nombreArticulo: string = null,
    public localizador: number = null,
    public marca: string = null,
    public stock: number = null,
    public puc: number = null,
    public pvp: number = null,
    public iva: number = null,
    public importe: number = null,
    public descuento: number = null,
    public importeDescuento: number = null,
    public unidades: number = null
  ) {}

  get total(): number {
    return Math.floor(this.pvp * this.unidades * 100) / 100;
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
