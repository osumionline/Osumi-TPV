import { PedidoLineaInterface } from '@interfaces/pedido.interface';
import Articulo from '@model/articulos/articulo.model';
import { getTwoNumberDecimal, urldecode, urlencode } from '@osumi/tools';

export default class PedidoLinea {
  showCodigoBarras: boolean = false;
  descuentoPedido: number = 0;
  mostrarObsPedidos: boolean = false;
  observaciones: string | null = null;

  constructor(
    public id: number | null = null,
    public idArticulo: number | null = null,
    public nombreArticulo: string | null = null,
    public localizador: number | null = null,
    public idMarca: number | null = null,
    public marca: string | null = null,
    public unidades: number | null = null,
    public palb: number | null = null,
    public puc: number | null = null,
    public pvp: number | null = null,
    public margen: number | null = null,
    public stock: number | null = null,
    public iva: number | null = null,
    public re: number | null = null,
    public descuento: number | null = null,
    public codBarras: string | null = null,
    public hasCodBarras: boolean = false,
    public referencia: string | null = null
  ) {}

  get subtotal(): number {
    return (
      (this.unidades ?? 0) *
      (this.palb ?? 0) *
      (1 - (this.descuento ?? 0) / 100) *
      (1 - this.descuentoPedido / 100)
    );
  }

  get total(): number {
    return getTwoNumberDecimal((this.unidades ?? 0) * (this.puc ?? 0));
  }

  get beneficio(): number {
    return (this.unidades ?? 0) * ((this.pvp ?? 0) - (this.puc ?? 0));
  }

  fromInterface(pl: PedidoLineaInterface): PedidoLinea {
    this.id = pl.id;
    this.idArticulo = pl.idArticulo;
    this.nombreArticulo = urldecode(pl.nombreArticulo);
    this.localizador = pl.localizador;
    this.idMarca = pl.idMarca;
    this.marca = urldecode(pl.marca);
    this.unidades = pl.unidades;
    this.palb = pl.palb;
    this.puc = pl.puc;
    this.pvp = pl.pvp;
    this.margen = pl.margen;
    this.stock = pl.stock;
    this.iva = pl.iva;
    this.re = pl.re;
    this.descuento = pl.descuento;
    this.codBarras = pl.codBarras;
    this.hasCodBarras = pl.hasCodBarras;
    this.referencia = urldecode(pl.referencia);

    return this;
  }

  fromArticulo(a: Articulo): PedidoLinea {
    this.id = null;
    this.idArticulo = a.id;
    this.nombreArticulo = a.nombre;
    this.localizador = a.localizador;
    this.idMarca = a.idMarca;
    this.marca = a.marca;
    this.unidades = 1;
    this.palb = a.palb;
    this.puc = a.puc;
    this.pvp = a.pvp;
    this.margen = a.margen;
    this.stock = a.stock;
    this.iva = a.iva;
    this.re = a.re;
    this.descuento = 0;
    this.codBarras = null;
    this.referencia = a.referencia;
    this.hasCodBarras = a.hasCodigoBarras;
    this.mostrarObsPedidos = a.mostrarObsPedidos;
    this.observaciones = a.observaciones;

    return this;
  }

  toInterface(): PedidoLineaInterface {
    return {
      id: this.id,
      idArticulo: this.idArticulo,
      nombreArticulo: urlencode(this.nombreArticulo),
      localizador: this.localizador,
      idMarca: this.idMarca,
      marca: urlencode(this.marca),
      unidades: this.unidades,
      palb: this.palb,
      puc: this.puc,
      pvp: this.pvp,
      margen: this.margen,
      stock: this.stock,
      iva: this.iva,
      re: this.re,
      descuento: this.descuento,
      codBarras: this.codBarras,
      hasCodBarras: this.hasCodBarras,
      referencia: urlencode(this.referencia),
    };
  }
}
