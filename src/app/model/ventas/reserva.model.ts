import { ReservaInterface, ReservaLineaInterface } from '@interfaces/cliente.interface';
import Cliente from '@model/clientes/cliente.model';
import ReservaLinea from '@model/ventas/reserva-linea.model';

export default class Reserva {
  _totalUnidades: number | null = null;
  _totalDescuento: number | null = null;

  constructor(
    public id: number | null = null,
    public idCliente: number | null = null,
    public cliente: Cliente | null = null,
    public total: number | null = null,
    public fecha: string | null = null,
    public lineas: ReservaLinea[] = []
  ) {}

  get totalUnidades(): number {
    if (this._totalUnidades !== null) {
      return this._totalUnidades;
    }
    let unidades: number = 0;

    for (const linea of this.lineas) {
      unidades += linea.unidades ?? 0;
    }

    this._totalUnidades = unidades;

    return this._totalUnidades;
  }

  get totalDescuento(): number {
    if (this._totalDescuento !== null) {
      return this._totalDescuento;
    }
    let descuento: number = 0;

    for (const linea of this.lineas) {
      if (linea.importeDescuento) {
        descuento += linea.importeDescuento;
      } else {
        if (linea.descuento !== 0) {
          descuento += linea.total * ((linea.descuento ?? 0) / 100);
        }
      }
    }

    this._totalDescuento = descuento;

    return this._totalDescuento;
  }

  fromInterface(r: ReservaInterface): Reserva {
    this.id = r.id;
    this.idCliente = r.idCliente;
    this.cliente = r.cliente !== null ? new Cliente().fromInterface(r.cliente) : null;
    this.total = r.total;
    this.fecha = r.fecha;
    this.lineas = r.lineas.map((rl: ReservaLineaInterface): ReservaLinea => {
      return new ReservaLinea().fromInterface(rl);
    });

    return this;
  }

  toInterface(): ReservaInterface {
    return {
      id: this.id,
      idCliente: this.idCliente,
      cliente: this.cliente !== null ? this.cliente.toInterface() : null,
      total: this.total,
      fecha: this.fecha,
      lineas: this.lineas.map((rl: ReservaLinea): ReservaLineaInterface => {
        return rl.toInterface();
      }),
    };
  }
}
