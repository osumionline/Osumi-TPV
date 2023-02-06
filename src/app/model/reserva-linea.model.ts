import { ReservaLineaInterface } from "src/app/interfaces/cliente.interface";
import { Utils } from "src/app/shared/utils.class";

export class ReservaLinea {
  constructor(
    public id: number = null,
    public idArticulo: number = null,
    public nombreArticulo: string = null,
    public localizador: number = null,
    public marca: string = null,
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
    this.nombreArticulo = Utils.urldecode(rl.nombreArticulo);
    this.localizador = rl.localizador;
    this.marca = Utils.urldecode(rl.marca);
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
      nombreArticulo: Utils.urlencode(this.nombreArticulo),
      localizador: this.localizador,
      marca: Utils.urlencode(this.marca),
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
