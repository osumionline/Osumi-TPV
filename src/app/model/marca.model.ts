import { MarcaInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class Marca {
  crearProveedor: boolean = false;

  constructor(
    public id: number = null,
    public nombre: string = "",
    public direccion: string = "",
    public foto: string = null,
    public telefono: string = "",
    public email: string = "",
    public web: string = "",
    public observaciones: string = ""
  ) {}

  fromInterface(m: MarcaInterface, decode: boolean = true): Marca {
    this.id = m.id;
    this.nombre = decode ? Utils.urldecode(m.nombre) : m.nombre;
    this.direccion = decode ? Utils.urldecode(m.direccion) : m.direccion;
    this.foto = m.foto;
    this.telefono = decode ? Utils.urldecode(m.telefono) : m.telefono;
    this.email = decode ? Utils.urldecode(m.email) : m.email;
    this.web = decode ? Utils.urldecode(m.web) : m.web;
    this.observaciones = decode
      ? Utils.urldecode(m.observaciones)
      : m.observaciones;

    return this;
  }

  toInterface(encode: boolean = true): MarcaInterface {
    return {
      id: this.id,
      nombre: encode ? Utils.urlencode(this.nombre) : this.nombre,
      direccion: encode ? Utils.urlencode(this.direccion) : this.direccion,
      foto: this.foto,
      telefono: encode ? Utils.urlencode(this.telefono) : this.telefono,
      email: encode ? Utils.urlencode(this.email) : this.email,
      web: encode ? Utils.urlencode(this.web) : this.web,
      observaciones: encode
        ? Utils.urlencode(this.observaciones)
        : this.observaciones,
      crearProveedor: this.crearProveedor,
    };
  }
}
