import { ComercialInterface } from '@interfaces/proveedor.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class Comercial {
  constructor(
    public id: number | null = null,
    public idProveedor: number | null = null,
    public nombre: string | null = null,
    public telefono: string | null = null,
    public email: string | null = null,
    public observaciones: string | null = null
  ) {}

  fromInterface(c: ComercialInterface, decode: boolean = true): Comercial {
    this.id = c.id;
    this.idProveedor = c.idProveedor;
    this.nombre = decode ? urldecode(c.nombre) : c.nombre;
    this.telefono = decode ? urldecode(c.telefono) : c.telefono;
    this.email = decode ? urldecode(c.email) : c.email;
    this.observaciones = decode ? urldecode(c.observaciones) : c.observaciones;

    return this;
  }

  toInterface(encode: boolean = true): ComercialInterface {
    return {
      id: this.id,
      idProveedor: this.idProveedor,
      nombre: encode ? urlencode(this.nombre) : this.nombre,
      telefono: encode ? urlencode(this.telefono) : this.telefono,
      email: encode ? urlencode(this.email) : this.email,
      observaciones: encode ? urlencode(this.observaciones) : this.observaciones,
    };
  }
}
