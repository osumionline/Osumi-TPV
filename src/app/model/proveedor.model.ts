import {
  ComercialInterface,
  ProveedorInterface,
} from "src/app/interfaces/proveedor.interface";
import { Comercial } from "src/app/model/comercial.model";
import { Utils } from "src/app/shared/utils.class";

export class Proveedor {
  constructor(
    public id: number = null,
    public nombre: string = "",
    public foto: string = null,
    public direccion: string = "",
    public telefono: string = "",
    public email: string = "",
    public web: string = "",
    public observaciones: string = "",
    public marcas: number[] = [],
    public comerciales: Comercial[] = []
  ) {}

  fromInterface(
    p: ProveedorInterface,
    comerciales: Comercial[],
    decode: boolean = true
  ): Proveedor {
    this.id = p.id;
    this.nombre = decode ? Utils.urldecode(p.nombre) : p.nombre;
    this.foto = p.foto;
    this.direccion = decode ? Utils.urldecode(p.direccion) : p.direccion;
    this.telefono = decode ? Utils.urldecode(p.telefono) : p.telefono;
    this.email = decode ? Utils.urldecode(p.email) : p.email;
    this.web = decode ? Utils.urldecode(p.web) : p.web;
    this.observaciones = decode
      ? Utils.urldecode(p.observaciones)
      : p.observaciones;
    if (p.marcas) {
      this.marcas = p.marcas;
    }
    if (comerciales !== null) {
      this.comerciales = comerciales;
    }

    return this;
  }

  toInterface(encode: boolean = true): ProveedorInterface {
    return {
      id: this.id,
      nombre: encode ? Utils.urlencode(this.nombre) : this.nombre,
      foto: this.foto,
      direccion: encode ? Utils.urlencode(this.direccion) : this.direccion,
      telefono: encode ? Utils.urlencode(this.telefono) : this.telefono,
      email: encode ? Utils.urlencode(this.email) : this.email,
      web: encode ? Utils.urlencode(this.web) : this.web,
      observaciones: encode
        ? Utils.urlencode(this.observaciones)
        : this.observaciones,
      marcas: this.marcas,
      comerciales: this.comerciales.map((c: Comercial): ComercialInterface => {
        return c.toInterface();
      }),
    };
  }
}
