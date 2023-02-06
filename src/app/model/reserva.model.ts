import {
  ReservaInterface,
  ReservaLineaInterface,
} from "src/app/interfaces/cliente.interface";
import { Cliente } from "src/app/model/cliente.model";
import { ReservaLinea } from "src/app/model/reserva-linea.model";

export class Reserva {
  _totalUnidades: number = null;
  _totalDescuento: number = null;

  constructor(
    public id: number = null,
    public idCliente: number = null,
    public cliente: Cliente = null,
    public total: number = null,
    public fecha: string = null,
    public lineas: ReservaLinea[] = []
  ) {}

  get totalUnidades(): number {
    if (this._totalUnidades !== null) {
      return this._totalUnidades;
    }
    let unidades: number = 0;

    for (let linea of this.lineas) {
      unidades += linea.unidades;
    }

    this._totalUnidades = unidades;

    return this._totalUnidades;
  }

  get totalDescuento(): number {
    if (this._totalDescuento !== null) {
      return this._totalDescuento;
    }
    let descuento: number = 0;

    for (let linea of this.lineas) {
      if (linea.importeDescuento) {
        descuento += linea.importeDescuento;
      } else {
        if (linea.descuento !== 0) {
          descuento += linea.total * (linea.descuento / 100);
        }
      }
    }

    this._totalDescuento = descuento;

    return this._totalDescuento;
  }

  fromInterface(r: ReservaInterface): Reserva {
    this.id = r.id;
    this.idCliente = r.idCliente;
    this.cliente = new Cliente().fromInterface(r.cliente);
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
      cliente: this.cliente.toInterface(),
      total: this.total,
      fecha: this.fecha,
      lineas: this.lineas.map((rl: ReservaLinea): ReservaLineaInterface => {
        return rl.toInterface();
      }),
    };
  }
}
