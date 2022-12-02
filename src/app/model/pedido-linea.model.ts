import { PedidoLineaInterface } from "src/app/interfaces/interfaces";
import { Articulo } from "src/app/model/articulo.model";
import { Utils } from "src/app/shared/utils.class";
import { IVAOption } from "./iva-option.model";

export class PedidoLinea {
  selectedIvaOption: IVAOption = new IVAOption();

  constructor(
    public idArticulo: number = null,
    public localizador: number = null,
    public descripcion: string = null,
    public idMarca: number = null,
    public marca: string = null,
    public unidades: number = null,
    public palb: number = null,
    public pvp: number = null,
    public stock: number = null,
    public iva: number = null,
    public re: number = null,
    public descuento: number = null,
    public idCategoria: number = null,
    public codBarras: number = null,
    public referencia: string = null
  ) {}

  get subtotal(): number {
    return this.unidades * this.palb;
  }

  get puc(): number {
    return this.palb * (1 + this.iva / 100 + this.re / 100);
  }

  get total(): number {
    return this.unidades * (this.puc * (1 - this.descuento / 100));
  }

  get beneficio(): number {
    return this.pvp - this.puc;
  }

  get margen(): number {
    return 100 - (this.puc * 100) / this.pvp;
  }

  fromInterface(pl: PedidoLineaInterface): PedidoLinea {
    this.idArticulo = pl.idArticulo;
    this.localizador = pl.localizador;
    this.descripcion = Utils.urldecode(pl.descripcion);
    this.idMarca = pl.idMarca;
    this.marca = Utils.urldecode(pl.marca);
    this.unidades = pl.unidades;
    this.palb = pl.palb;
    this.pvp = pl.pvp;
    this.stock = pl.stock;
    this.iva = pl.iva;
    this.re = pl.re;
    this.descuento = pl.descuento;
    this.idCategoria = pl.idCategoria;
    this.codBarras = pl.codBarras;
    this.referencia = Utils.urldecode(pl.referencia);

    return this;
  }

  fromArticulo(a: Articulo): PedidoLinea {
    this.idArticulo = a.id;
    this.localizador = a.localizador;
    this.descripcion = a.nombre;
    this.idMarca = a.idMarca;
    this.marca = a.marca;
    this.unidades = 1;
    this.palb = a.palb;
    this.pvp = a.pvp;
    this.stock = a.stock;
    this.iva = a.iva;
    this.re = a.re;
    this.descuento = 0;
    this.idCategoria = a.idCategoria;
    this.codBarras = null;
    this.referencia = a.referencia;

    return this;
  }

  toInterface(): PedidoLineaInterface {
    return {
      idArticulo: this.idArticulo,
      localizador: this.localizador,
      descripcion: Utils.urlencode(this.descripcion),
      idMarca: this.idMarca,
      marca: Utils.urlencode(this.marca),
      unidades: this.unidades,
      palb: this.palb,
      pvp: this.pvp,
      stock: this.stock,
      iva: this.iva,
      re: this.re,
      descuento: this.descuento,
      idCategoria: this.idCategoria,
      codBarras: this.codBarras,
      referencia: Utils.urlencode(this.referencia),
    };
  }
}
