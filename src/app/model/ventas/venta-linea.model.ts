import { VentaLineaInterface } from "src/app/interfaces/venta.interface";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { ReservaLinea } from "src/app/model/ventas/reserva-linea.model";

export class VentaLinea {
  importeManual: boolean = false;
  descuentoManual: boolean = false;
  animarCantidad: boolean = false;

  constructor(
    public id: number = null,
    public idArticulo: number = null,
    public localizador: number = null,
    public descripcion: string = null,
    public marca: string = null,
    public stock: number = null,
    public cantidad: number = null,
    public pvp: number = null,
    public importe: number = null,
    public descuento: number = null,
    public iva: number = null,
    public observaciones: string = null,
    public fromVenta: number = null,
    public fromReserva: number = null,
    public fromReservaLineaId: number = null,
    public regalo: boolean = false
  ) {}

  get total(): number {
    if (this.importeManual) {
      return this.importe;
    }
    if (this.descuentoManual) {
      return this.importe - this.descuento;
    }
    return this.importe * (1 - this.descuento / 100);
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
    if (a.pvpDescuento !== null) {
      this.pvp = a.pvpDescuento;
    }
    this.importe = a.pvp;
    this.descuento = 0;
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
