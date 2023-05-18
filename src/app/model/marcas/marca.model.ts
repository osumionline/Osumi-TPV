import { urldecode, urlencode } from "@osumi/tools";
import { MarcaInterface } from "src/app/interfaces/marca.interface";

export class Marca {
  crearProveedor: boolean = false;

  constructor(
    public id: number = null,
    public nombre: string = null,
    public direccion: string = null,
    public foto: string = null,
    public telefono: string = null,
    public email: string = null,
    public web: string = null,
    public observaciones: string = null,
    public proveedor: string = null
  ) {}

  fromInterface(m: MarcaInterface, decode: boolean = true): Marca {
    this.id = m.id;
    this.nombre = decode ? urldecode(m.nombre) : m.nombre;
    this.direccion = decode ? urldecode(m.direccion) : m.direccion;
    this.foto = m.foto;
    this.telefono = decode ? urldecode(m.telefono) : m.telefono;
    this.email = decode ? urldecode(m.email) : m.email;
    this.web = decode ? urldecode(m.web) : m.web;
    this.observaciones = decode ? urldecode(m.observaciones) : m.observaciones;
    this.proveedor = decode ? urldecode(m.proveedor) : m.proveedor;

    return this;
  }

  toInterface(encode: boolean = true): MarcaInterface {
    return {
      id: this.id,
      nombre: encode ? urlencode(this.nombre) : this.nombre,
      direccion: encode ? urlencode(this.direccion) : this.direccion,
      foto: this.foto,
      telefono: encode ? urlencode(this.telefono) : this.telefono,
      email: encode ? urlencode(this.email) : this.email,
      web: encode ? urlencode(this.web) : this.web,
      observaciones: encode
        ? urlencode(this.observaciones)
        : this.observaciones,
      crearProveedor: this.crearProveedor,
      proveedor: encode ? urlencode(this.proveedor) : this.proveedor,
    };
  }
}
