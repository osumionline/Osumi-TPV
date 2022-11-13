import { ProveedorInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class Proveedor {
  constructor(
    public id: number = null,
    public nombre: string = "",
    public idFoto: number = null,
    public direccion: string = "",
    public telefono: string = "",
    public email: string = "",
    public web: string = "",
    public observaciones: string = "",
    public marcas: number[] = []
  ) {}

  fromInterface(p: ProveedorInterface, decode: boolean = true): Proveedor {
    this.id = p.id;
    this.nombre = decode ? Utils.urldecode(p.nombre) : p.nombre;
    this.idFoto = p.idFoto;
    this.direccion = decode ? Utils.urldecode(p.direccion) : p.direccion;
    this.telefono = decode ? Utils.urldecode(p.telefono) : p.telefono;
    this.email = decode ? Utils.urldecode(p.email) : p.email;
    this.web = decode ? Utils.urldecode(p.web) : p.web;
    this.observaciones = decode
      ? Utils.urldecode(p.observaciones)
      : p.observaciones;
    this.marcas = p.marcas;

    return this;
  }

  toInterface(encode: boolean = true): ProveedorInterface {
    return {
      id: this.id,
      nombre: encode ? Utils.urlencode(this.nombre) : this.nombre,
      idFoto: this.idFoto,
      direccion: encode ? Utils.urlencode(this.direccion) : this.direccion,
      telefono: encode ? Utils.urlencode(this.telefono) : this.telefono,
      email: encode ? Utils.urlencode(this.email) : this.email,
      web: encode ? Utils.urlencode(this.web) : this.web,
      observaciones: encode
        ? Utils.urlencode(this.observaciones)
        : this.observaciones,
      marcas: this.marcas,
    };
  }
}
