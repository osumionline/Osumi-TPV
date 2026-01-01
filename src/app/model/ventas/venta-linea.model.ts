import { VentaLineaInterface } from '@interfaces/venta.interface';
import Articulo from '@model/articulos/articulo.model';
import ReservaLinea from '@model/ventas/reserva-linea.model';

export default class VentaLinea {
  importeManual: boolean = false;
  descuentoManual: boolean = false;
  animarCantidad: boolean = false;
  descuentoManualAnterior: boolean = false;
  descuentoAnterior: number | null = null;

  constructor(
    public id: number | null = null,
    public idArticulo: number | null = null,
    public localizador: number | null = null,
    public descripcion: string | null = null,
    public marca: string | null = null,
    public stock: number | null = null,
    public cantidad: number | null = null,
    public pvp: number | null = null,
    public importe: number | null = null,
    public descuento: number | null = null,
    public iva: number | null = null,
    public observaciones: string | null = null,
    public fromVenta: number | null = null,
    public fromReserva: number | null = null,
    public fromReservaLineaId: number | null = null,
    public regalo: boolean = false
  ) {}

  get total(): number | null {
    if (this.importeManual) {
      return this.importe;
    }
    if (this.descuentoManual) {
      return (this.importe ?? 0) - (this.descuento ?? 0);
    }
    return (this.importe ?? 0) * (1 - (this.descuento ?? 0) / 100);
  }

  updateImporte(): void {
    if (!this.importeManual) {
      if (this.cantidad !== null && this.pvp !== null) {
        this.importe = this.cantidad * this.pvp;
      } else {
        this.importe = null;
      }
    }
  }

  fromArticulo(a: Articulo): VentaLinea {
    this.idArticulo = a.id;
    this.localizador = a.localizador;
    this.descripcion = a.nombre;
    this.marca = a.marca;
    this.stock = a.stock;
    this.cantidad = 1;
    this.pvp = a.pvp;
    this.descuento = 0;
    if (a.pvpDescuento !== null) {
      this.descuento = (a.pvp ?? 0) - a.pvpDescuento;
      this.descuentoManual = true;
    }
    this.importe = a.pvp;
    this.iva = a.iva;
    this.observaciones = a.mostrarObsVentas ? a.observaciones : null;

    return this;
  }

  fromLineaReserva(rl: ReservaLinea): VentaLinea {
    this.fromReservaLineaId = rl.id;
    this.idArticulo = rl.idArticulo !== null ? rl.idArticulo : 0;
    this.localizador = rl.localizador !== null ? rl.localizador : 0;
    this.descripcion = rl.nombreArticulo;
    this.marca = rl.marca;
    this.stock = rl.stock;
    this.cantidad = rl.unidades;
    this.pvp = rl.pvp;
    this.importe = rl.pvp;
    this.descuento = rl.descuento;
    this.iva = rl.iva;
    this.observaciones = null;

    return this;
  }

  fromInterface(lv: VentaLineaInterface): VentaLinea {
    this.id = lv.id;
    this.idArticulo = lv.idArticulo;
    this.localizador = lv.localizador;
    this.descripcion = lv.descripcion;
    this.marca = lv.marca;
    this.stock = lv.stock;
    this.cantidad = lv.cantidad;
    this.pvp = lv.pvp;
    this.importe = lv.importe;
    this.descuento = lv.descuento;
    this.iva = lv.iva;
    this.observaciones = lv.observaciones;
    this.regalo = lv.regalo;

    return this;
  }

  toInterface(): VentaLineaInterface {
    return {
      id: this.id,
      idArticulo: this.idArticulo,
      localizador: this.localizador,
      descripcion: this.descripcion,
      marca: this.marca,
      stock: this.stock,
      cantidad: this.cantidad,
      pvp: this.pvp,
      importe: this.importe,
      descuento: this.descuento,
      descuentoManual: this.descuentoManual,
      iva: this.iva,
      observaciones: this.observaciones,
      fromVenta: this.fromVenta,
      fromReserva: this.fromReserva,
      fromReservaLineaId: this.fromReservaLineaId,
      regalo: this.regalo,
    };
  }
}
