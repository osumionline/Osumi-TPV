import { InventarioItemInterface } from '@interfaces/almacen.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class InventarioItem {
  _idCategoria: number | null = null;
  _stock: number | null = null;
  _palb: number | null = null;
  _pvp: number | null = null;
  codigoBarras: string | null = null;

  constructor(
    public id: number | null = null,
    public localizador: number | null = null,
    public idCategoria: number | null = null,
    public marca: string | null = null,
    public proveedor: string | null = null,
    public referencia: string | null = null,
    public nombre: string | null = null,
    public stock: number | null = null,
    public palb: number | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public hasCodigosBarras: boolean = false,
    public observaciones: string | null = null,
    public sinVentas: boolean = false,
  ) {
    this._idCategoria = idCategoria;
    this._palb = palb;
    this._stock = stock;
    this._pvp = pvp;
  }

  get categoriaChanged(): boolean {
    return this._idCategoria !== this.idCategoria;
  }

  get stockChanged(): boolean {
    return this._stock !== this.stock;
  }

  get palbChanged(): boolean {
    return this._palb !== this.palb;
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
    this.idCategoria = ii.idCategoria;
    this.marca = urldecode(ii.marca);
    this.proveedor = ii.proveedor !== null ? urldecode(ii.proveedor) : null;
    this.referencia = urldecode(ii.referencia);
    this.nombre = urldecode(ii.nombre);
    this.stock = ii.stock;
    this._stock = ii.stock;
    this.palb = ii.palb;
    this._palb = ii.palb;
    this.puc = ii.puc;
    this.pvp = ii.pvp;
    this._pvp = ii.pvp;
    this.hasCodigosBarras = ii.hasCodigosBarras;
    this.observaciones = urldecode(ii.observaciones);
    this.sinVentas = ii.sinVentas;

    return this;
  }

  toInterface(): InventarioItemInterface {
    return {
      id: this.id,
      localizador: this.localizador,
      idCategoria: this.idCategoria,
      marca: urlencode(this.marca),
      proveedor: this.proveedor !== null ? urlencode(this.proveedor) : null,
      referencia: urlencode(this.referencia),
      nombre: urlencode(this.nombre),
      stock: this.stock,
      palb: this.palb,
      puc: this.puc,
      pvp: this.pvp,
      hasCodigosBarras: this.hasCodigosBarras,
      codigoBarras: this.codigoBarras,
      observaciones: urlencode(this.observaciones),
      sinVentas: this.sinVentas,
    };
  }
}
