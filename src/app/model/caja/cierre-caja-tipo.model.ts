import { CierreCajaTipoInterface } from "src/app/interfaces/caja.interface";
import { Utils } from "src/app/shared/utils.class";

export class CierreCajaTipo {
  real: number = null;
  show: boolean = false;

  constructor(
    public id: number = null,
    public nombre: string = null,
    public ventas: number = null,
    public operaciones: number = null
  ) {
    this.real = ventas;
  }

  get diferencia(): number {
    return -1 * (this.ventas - this.real);
  }

  fromInterface(cct: CierreCajaTipoInterface): CierreCajaTipo {
    this.id = cct.id;
    this.nombre = Utils.urldecode(cct.nombre);
    this.ventas = cct.ventas;
    this.operaciones = cct.operaciones;
    this.real = cct.ventas;

    return this;
  }

  toInterface(): CierreCajaTipoInterface {
    return {
      id: this.id,
      nombre: Utils.urlencode(this.nombre),
      ventas: this.ventas,
      real: this.real,
      operaciones: this.operaciones,
    };
  }
}
