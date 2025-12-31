import { EmpleadoInterface, EmpleadoLoginInterface } from '@interfaces/empleado.interface';
import { ColorValues } from '@interfaces/interfaces';
import { hexToRgbFloat, urldecode, urlencode } from '@osumi/tools';
import { rolList } from '@shared/rol.class';

export default class Empleado {
  pass: string | null = null;
  _textColor: string | null = null;

  constructor(
    public id: number | null = null,
    public nombre: string | null = null,
    public hasPassword: boolean = false,
    public color: string | null = null,
    public roles: number[] = []
  ) {}

  get textColor(): string {
    if (this._textColor !== null) {
      return this._textColor;
    }
    if (!this.color) {
      this._textColor = '#000';
      return this._textColor;
    }
    const color: ColorValues | null = hexToRgbFloat(this.color);
    if (!color) {
      this._textColor = '#000';
      return this._textColor;
    }
    const o: number = Math.round(
      (parseInt(color.r.toString()) * 299 +
        parseInt(color.g.toString()) * 587 +
        parseInt(color.b.toString()) * 114) /
        1000
    );

    if (o > 125) {
      this._textColor = '#000';
    } else {
      this._textColor = '#fff';
    }
    return this._textColor;
  }

  fromInterface(e: EmpleadoInterface, decode: boolean = true): Empleado {
    this.id = e.id;
    this.nombre = decode ? urldecode(e.nombre) : e.nombre;
    this.hasPassword = e.hasPassword;
    this.color = '#' + e.color;
    this.roles = e.roles;

    return this;
  }

  fromDefault(id: number | null, color: string | null): Empleado {
    this.id = id;
    this.nombre = '';
    this.color = color;
    this.roles = [rolList['ventas'].roles['modificarImportes'].id];

    return this;
  }

  toInterface(encode: boolean = true): EmpleadoInterface {
    return {
      id: this.id,
      nombre: encode ? urlencode(this.nombre) : this.nombre,
      hasPassword: this.hasPassword,
      color: this.color,
      roles: this.roles,
    };
  }

  toLoginInterface(): EmpleadoLoginInterface {
    return {
      id: this.id,
      pass: urlencode(this.pass),
    };
  }

  hasRol(rol: number): boolean {
    return this.roles.indexOf(rol) != -1;
  }

  hasAnyRol(roles: number[]): boolean {
    return this.roles.some((r: number): boolean => roles.includes(r));
  }
}
