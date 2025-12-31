import { ComercialInterface, ProveedorInterface } from '@interfaces/proveedor.interface';
import Comercial from '@model/proveedores/comercial.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Proveedor {
  constructor(
    public id: number | null = null,
    public nombre: string | null = null,
    public foto: string | null = null,
    public direccion: string | null = null,
    public telefono: string | null = null,
    public email: string | null = null,
    public web: string | null = null,
    public observaciones: string | null = null,
    public marcas: number[] = [],
    public comerciales: Comercial[] = []
  ) {}

  fromInterface(
    p: ProveedorInterface,
    comerciales: Comercial[] | null,
    decode: boolean = true
  ): Proveedor {
    this.id = p.id;
    this.nombre = decode ? urldecode(p.nombre) : p.nombre;
    this.foto = p.foto;
    this.direccion = decode ? urldecode(p.direccion) : p.direccion;
    this.telefono = decode ? urldecode(p.telefono) : p.telefono;
    this.email = decode ? urldecode(p.email) : p.email;
    this.web = decode ? urldecode(p.web) : p.web;
    this.observaciones = decode ? urldecode(p.observaciones) : p.observaciones;
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
      nombre: encode ? urlencode(this.nombre) : this.nombre,
      foto: this.foto,
      direccion: encode ? urlencode(this.direccion) : this.direccion,
      telefono: encode ? urlencode(this.telefono) : this.telefono,
      email: encode ? urlencode(this.email) : this.email,
      web: encode ? urlencode(this.web) : this.web,
      observaciones: encode ? urlencode(this.observaciones) : this.observaciones,
      marcas: this.marcas,
      comerciales: this.comerciales.map((c: Comercial): ComercialInterface => {
        return c.toInterface();
      }),
    };
  }
}
