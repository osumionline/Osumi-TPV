import { CierreCajaTipoInterface } from '@interfaces/caja.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class CierreCajaTipo {
  real: number | null = null;
  show: boolean = false;

  constructor(
    public id: number | null = null,
    public nombre: string | null = null,
    public ventas: number | null = null,
    public operaciones: number | null = null
  ) {
    this.real = ventas;
  }

  get diferencia(): number {
    return -1 * ((this.ventas ?? 0) - (this.real ?? 0));
  }

  fromInterface(cct: CierreCajaTipoInterface): CierreCajaTipo {
    this.id = cct.id;
    this.nombre = urldecode(cct.nombre);
    this.ventas = cct.ventas;
    this.operaciones = cct.operaciones;
    this.real = cct.ventas;

    return this;
  }

  toInterface(): CierreCajaTipoInterface {
    return {
      id: this.id,
      nombre: urlencode(this.nombre),
      ventas: this.ventas,
      real: this.real,
      operaciones: this.operaciones,
    };
  }
}
