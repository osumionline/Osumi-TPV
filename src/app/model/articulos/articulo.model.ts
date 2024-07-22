import {
  ArticuloInterface,
  CodigoBarrasInterface,
  EtiquetaInterface,
  EtiquetaWebInterface,
  FotoInterface,
} from '@interfaces/articulo.interface';
import CodigoBarras from '@model/articulos/codigo-barras.model';
import EtiquetaWeb from '@model/articulos/etiqueta-web.model';
import Etiqueta from '@model/articulos/etiqueta.model';
import Foto from '@model/articulos/foto.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Articulo {
  tabName: string = '';
  status: 'new' | 'load' | 'loaded' = 'new';
  marca: string = '';
  proveedor: string = '';
  fotosList: Foto[] = [];
  nombreStatus: 'ok' | 'checked' = 'ok';
  descuento: boolean = false;
  porcentajeDescuento: number = null;

  constructor(
    public id: number = null,
    public localizador: number = null,
    public nombre: string = null,
    public idCategoria: number = null,
    public idMarca: number = null,
    public idProveedor: number = null,
    public referencia: string = '',
    public palb: number = 0,
    public puc: number = 0,
    public pvp: number = 0,
    public pvpDescuento: number = null,
    public iva: number = 0,
    public re: number = 0,
    public margen: number = 0,
    public margenDescuento: number = null,
    public stock: number = 0,
    public stockMin: number = 0,
    public stockMax: number = 0,
    public loteOptimo: number = 0,
    public ventaOnline: boolean = false,
    public fechaCaducidad: string = null,
    public mostrarEnWeb: boolean = false,
    public descCorta: string = '',
    public descripcion: string = '',
    public observaciones: string = '',
    public mostrarObsPedidos: boolean = false,
    public mostrarObsVentas: boolean = false,
    public accesoDirecto: number = null,
    public codigosBarras: CodigoBarras[] = [],
    public fotos: number[] = [],
    public etiquetas: Etiqueta[] = [],
    public etiquetasWeb: EtiquetaWeb[] = []
  ) {}

  fromInterface(a: ArticuloInterface, decode: boolean = true): Articulo {
    this.id = a.id;
    this.localizador = a.localizador;
    this.nombre = decode ? urldecode(a.nombre) : a.nombre;
    this.idCategoria = a.idCategoria;
    this.idMarca = a.idMarca;
    this.idProveedor = a.idProveedor;
    this.referencia = a.referencia;
    this.puc = a.puc;
    this.pvp = a.pvp;
    this.pvpDescuento = a.pvpDescuento;
    this.palb = a.palb;
    this.iva = a.iva;
    this.re = a.re;
    this.margen = a.margen;
    this.margenDescuento = a.margenDescuento;
    this.stock = a.stock;
    this.stockMin = a.stockMin;
    this.stockMax = a.stockMax;
    this.loteOptimo = a.loteOptimo;
    this.ventaOnline = a.ventaOnline;
    this.fechaCaducidad = a.fechaCaducidad;
    this.observaciones = decode ? urldecode(a.observaciones) : a.observaciones;
    this.mostrarObsPedidos = a.mostrarObsPedidos;
    this.mostrarObsVentas = a.mostrarObsVentas;
    this.mostrarEnWeb = a.mostrarEnWeb;
    this.descCorta = decode ? urldecode(a.descCorta) : a.descCorta;
    this.descripcion = decode ? urldecode(a.descripcion) : a.descripcion;
    this.accesoDirecto = a.accesoDirecto;
    if (a.codigosBarras) {
      this.codigosBarras = a.codigosBarras.map(
        (cb: CodigoBarrasInterface): CodigoBarras => {
          return new CodigoBarras().fromInterface(cb);
        }
      );
    }
    if (a.fotos) {
      this.fotos = a.fotos;
      this.fotosList = this.fotos.map((n: number): Foto => {
        return new Foto(n);
      });
    }
    if (a.etiquetas) {
      this.etiquetas = a.etiquetas.map((e: EtiquetaInterface): Etiqueta => {
        return new Etiqueta().fromInterface(e);
      });
    }
    if (a.etiquetasWeb) {
      this.etiquetasWeb = a.etiquetasWeb.map(
        (e: EtiquetaWebInterface): EtiquetaWeb => {
          return new EtiquetaWeb().fromInterface(e);
        }
      );
    }
    this.status = 'loaded';
    this.descuento = this.pvpDescuento !== null;

    return this;
  }

  get hasCodigoBarras(): boolean {
    for (const cod of this.codigosBarras) {
      if (cod.porDefecto === false) {
        return true;
      }
    }
    return false;
  }

  toInterface(encode: boolean = true): ArticuloInterface {
    return {
      id: this.id,
      localizador: this.localizador,
      nombre: encode ? urlencode(this.nombre) : this.nombre,
      idCategoria: this.idCategoria,
      idMarca: this.idMarca,
      idProveedor: this.idProveedor,
      referencia: this.referencia,
      puc: this.puc,
      pvp: this.pvp,
      pvpDescuento: this.pvpDescuento,
      palb: this.palb,
      iva: this.iva,
      re: this.re,
      margen: this.margen,
      margenDescuento: this.margenDescuento,
      stock: this.stock,
      stockMin: this.stockMin,
      stockMax: this.stockMax,
      loteOptimo: this.loteOptimo,
      ventaOnline: this.ventaOnline,
      fechaCaducidad: this.fechaCaducidad,
      observaciones: encode
        ? urlencode(this.observaciones)
        : this.observaciones,
      mostrarObsPedidos: this.mostrarObsPedidos,
      mostrarObsVentas: this.mostrarObsVentas,
      accesoDirecto: this.accesoDirecto,
      mostrarEnWeb: this.mostrarEnWeb,
      descCorta: encode ? urlencode(this.descCorta) : this.descCorta,
      descripcion: encode ? urlencode(this.descripcion) : this.descripcion,
      codigosBarras: this.codigosBarras.map(
        (cb: CodigoBarras): CodigoBarrasInterface => {
          return cb.toInterface();
        }
      ),
      fotos: this.fotos,
      fotosList: this.fotosList.map((f: Foto): FotoInterface => {
        return f.toInterface();
      }),
      nombreStatus: this.nombreStatus,
      etiquetas: this.etiquetas.map((e: Etiqueta): EtiquetaInterface => {
        return e.toInterface();
      }),
      etiquetasWeb: this.etiquetasWeb.map(
        (e: EtiquetaWeb): EtiquetaWebInterface => {
          return e.toInterface();
        }
      ),
    };
  }
}
