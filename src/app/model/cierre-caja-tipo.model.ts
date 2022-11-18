import { CierreCajaTipoInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class CierreCajaTipo {
  constructor(
    public id: number = null,
    public nombre: string = null,
    public ventas: number = null,
    public operaciones: number = null
  ) {}

  fromInterface(cct: CierreCajaTipoInterface): CierreCajaTipo {
    this.id = cct.id;
    this.nombre = Utils.urldecode(cct.nombre);
    this.ventas = cct.ventas;
    this.operaciones = cct.operaciones;

    return this;
  }

  toInterface(): CierreCajaTipoInterface {
    return {
      id: this.id,
      nombre: Utils.urlencode(this.nombre),
      ventas: this.ventas,
      operaciones: this.operaciones,
    };
  }
}
