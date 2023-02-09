import { ComercialInterface } from "src/app/interfaces/proveedor.interface";
import { Utils } from "src/app/shared/utils.class";

export class Comercial {
  constructor(
    public id: number = null,
    public idProveedor: number = null,
    public nombre: string = null,
    public telefono: string = null,
    public email: string = null,
    public observaciones: string = null
  ) {}

  fromInterface(c: ComercialInterface, decode: boolean = true): Comercial {
    this.id = c.id;
    this.idProveedor = c.idProveedor;
    this.nombre = decode ? Utils.urldecode(c.nombre) : c.nombre;
    this.telefono = decode ? Utils.urldecode(c.telefono) : c.telefono;
    this.email = decode ? Utils.urldecode(c.email) : c.email;
    this.observaciones = decode
      ? Utils.urldecode(c.observaciones)
      : c.observaciones;

    return this;
  }

  toInterface(encode: boolean = true): ComercialInterface {
    return {
      id: this.id,
      idProveedor: this.idProveedor,
      nombre: encode ? Utils.urlencode(this.nombre) : this.nombre,
      telefono: encode ? Utils.urlencode(this.telefono) : this.telefono,
      email: encode ? Utils.urlencode(this.email) : this.email,
      observaciones: encode
        ? Utils.urlencode(this.observaciones)
        : this.observaciones,
    };
  }
}
