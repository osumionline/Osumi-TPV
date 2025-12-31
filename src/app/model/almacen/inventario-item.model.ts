import { InventarioItemInterface } from '@interfaces/almacen.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class InventarioItem {
  _stock: number | null = null;
  _pvp: number | null = null;
  codigoBarras: string | null = null;

  constructor(
    public id: number | null = null,
    public localizador: number | null = null,
    public marca: string | null = null,
    public proveedor: string | null = null,
    public referencia: string | null = null,
    public nombre: string | null = null,
    public stock: number | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public hasCodigosBarras: boolean = false,
    public observaciones: string | null = null
  ) {
    this._stock = stock;
    this._pvp = pvp;
  }

  get stockChanged(): boolean {
    return this._stock !== this.stock;
  }

  get pvpChanged(): boolean {
    return this._pvp !== this.pvp;
  }

  get margen(): number {
    if (this.pvp === 0) {
      return 0;
    }
    return (100 * ((this.pvp ?? 0) - (this.puc ?? 0))) / (this.pvp ?? 0);
  }

  fromInterface(ii: InventarioItemInterface): InventarioItem {
    this.id = ii.id;
    this.localizador = ii.localizador;
    this.marca = urldecode(ii.marca);
    this.proveedor = ii.proveedor !== null ? urldecode(ii.proveedor) : null;
    this.referencia = urldecode(ii.referencia);
    this.nombre = urldecode(ii.nombre);
    this.stock = ii.stock;
    this._stock = ii.stock;
    this.puc = ii.puc;
    this.pvp = ii.pvp;
    this._pvp = ii.pvp;
    this.hasCodigosBarras = ii.hasCodigosBarras;
    this.observaciones = urldecode(ii.observaciones);

    return this;
  }

  toInterface(): InventarioItemInterface {
    return {
      id: this.id,
      localizador: this.localizador,
      marca: urlencode(this.marca),
      proveedor: this.proveedor !== null ? urlencode(this.proveedor) : null,
      referencia: urlencode(this.referencia),
      nombre: urlencode(this.nombre),
      stock: this.stock,
      puc: this.puc,
      pvp: this.pvp,
      hasCodigosBarras: this.hasCodigosBarras,
      codigoBarras: this.codigoBarras,
      observaciones: urlencode(this.observaciones),
    };
  }
}
