import {
  ColorValues,
  EmpleadoInterface,
  EmpleadoLoginInterface,
} from "src/app/interfaces/interfaces";
import { Rol } from "src/app/shared/rol.class";
import { Utils } from "src/app/shared/utils.class";

export class Empleado {
  pass: string = null;
  _textColor: string = null;

  constructor(
    public id: number = null,
    public nombre: string = null,
    public color: string = null,
    public roles: number[] = []
  ) {}

  get textColor(): string {
    if (this._textColor !== null) {
      return this._textColor;
    }
    if (!this.color) {
      this._textColor = "#000";
      return this._textColor;
    }
    const color: ColorValues = Utils.hexToRgbFloat(this.color);
    if (!color) {
      this._textColor = "#000";
      return this._textColor;
    }
    const o: number = Math.round(
      (parseInt(color.r.toString()) * 299 +
        parseInt(color.g.toString()) * 587 +
        parseInt(color.b.toString()) * 114) /
        1000
    );

    if (o > 125) {
      this._textColor = "#000";
    } else {
      this._textColor = "#fff";
    }
    return this._textColor;
  }

  fromInterface(e: EmpleadoInterface): Empleado {
    this.id = e.id;
    this.nombre = Utils.urldecode(e.nombre);
    this.color = e.color;
    this.roles = e.roles;

    return this;
  }

  fromDefault(id: number, color: string): Empleado {
    this.id = id;
    this.nombre = "";
    this.color = color;
    this.roles = [Rol.ventas.modificarImportes];

    return this;
  }

  toInterface(): EmpleadoInterface {
    return {
      id: this.id,
      nombre: Utils.urlencode(this.nombre),
      color: this.color,
      roles: this.roles,
    };
  }

  toLoginInterface(): EmpleadoLoginInterface {
    return {
      id: this.id,
      pass: Utils.urlencode(this.pass),
    };
  }

  hasRol(rol: number): boolean {
    return this.roles.indexOf(rol) != -1;
  }
}
