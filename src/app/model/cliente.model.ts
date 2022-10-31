import { ClienteInterface } from "src/app/interfaces/interfaces";
import { TopVentaArticulo } from "src/app/model/top-venta-articulo.model";
import { UltimaVentaArticulo } from "src/app/model/ultima-venta-articulo.model";
import { Utils } from "src/app/model/utils.class";

export class Cliente {
  ultimasVentas: UltimaVentaArticulo[] = [];
  topVentas: TopVentaArticulo[] = [];

  constructor(
    public id: number = null,
    public nombreApellidos: string = null,
    public dniCif: string = null,
    public telefono: string = null,
    public email: string = null,
    public direccion: string = null,
    public codigoPostal: string = null,
    public poblacion: string = null,
    public provincia: number = null,
    public factIgual: boolean = true,
    public factNombreApellidos: string = null,
    public factDniCif: string = null,
    public factTelefono: string = null,
    public factEmail: string = null,
    public factDireccion: string = null,
    public factCodigoPostal: string = null,
    public factPoblacion: string = null,
    public factProvincia: number = null,
    public observaciones: string = null,
    public ultimaVenta: string = null
  ) {}

  fromInterface(c: ClienteInterface, decode: boolean = true): Cliente {
    this.id = c.id;
    this.nombreApellidos = decode
      ? Utils.urldecode(c.nombreApellidos)
      : c.nombreApellidos;
    this.dniCif = decode ? Utils.urldecode(c.dniCif) : c.dniCif;
    this.telefono = decode ? Utils.urldecode(c.telefono) : c.telefono;
    this.email = decode ? Utils.urldecode(c.email) : c.email;
    this.direccion = decode ? Utils.urldecode(c.direccion) : c.direccion;
    this.codigoPostal = decode
      ? Utils.urldecode(c.codigoPostal)
      : c.codigoPostal;
    this.poblacion = decode ? Utils.urldecode(c.poblacion) : c.poblacion;
    this.provincia = c.provincia;
    this.factIgual = c.factIgual;
    this.factNombreApellidos = decode
      ? Utils.urldecode(c.factNombreApellidos)
      : c.factNombreApellidos;
    this.factDniCif = decode ? Utils.urldecode(c.factDniCif) : c.factDniCif;
    this.factTelefono = decode
      ? Utils.urldecode(c.factTelefono)
      : c.factTelefono;
    this.factEmail = decode ? Utils.urldecode(c.factEmail) : c.factEmail;
    this.factDireccion = decode
      ? Utils.urldecode(c.factDireccion)
      : c.factDireccion;
    this.factCodigoPostal = decode
      ? Utils.urldecode(c.factCodigoPostal)
      : c.factCodigoPostal;
    this.factPoblacion = decode
      ? Utils.urldecode(c.factPoblacion)
      : c.factPoblacion;
    this.factProvincia = c.factProvincia;
    this.observaciones = decode
      ? Utils.urldecode(c.observaciones)
      : c.observaciones;
    this.ultimaVenta = decode ? Utils.urldecode(c.ultimaVenta) : c.ultimaVenta;

    return this;
  }

  toInterface(encode: boolean = true): ClienteInterface {
    return {
      id: this.id,
      nombreApellidos: encode
        ? Utils.urlencode(this.nombreApellidos)
        : this.nombreApellidos,
      dniCif: encode ? Utils.urlencode(this.dniCif) : this.dniCif,
      telefono: encode ? Utils.urlencode(this.telefono) : this.telefono,
      email: encode ? Utils.urlencode(this.email) : this.email,
      direccion: encode ? Utils.urlencode(this.direccion) : this.direccion,
      codigoPostal: encode
        ? Utils.urlencode(this.codigoPostal)
        : this.codigoPostal,
      poblacion: encode ? Utils.urlencode(this.poblacion) : this.poblacion,
      provincia: this.provincia,
      factIgual: this.factIgual,
      factNombreApellidos: encode
        ? Utils.urlencode(this.factNombreApellidos)
        : this.factNombreApellidos,
      factDniCif: encode ? Utils.urlencode(this.factDniCif) : this.factDniCif,
      factTelefono: encode
        ? Utils.urlencode(this.factTelefono)
        : this.factTelefono,
      factEmail: encode ? Utils.urlencode(this.factEmail) : this.factEmail,
      factDireccion: encode
        ? Utils.urlencode(this.factDireccion)
        : this.factDireccion,
      factCodigoPostal: encode
        ? Utils.urlencode(this.factCodigoPostal)
        : this.factCodigoPostal,
      factPoblacion: encode
        ? Utils.urlencode(this.factPoblacion)
        : this.factPoblacion,
      factProvincia: this.factProvincia,
      observaciones: encode
        ? Utils.urlencode(this.observaciones)
        : this.observaciones,
      ultimaVenta: encode
        ? Utils.urlencode(this.ultimaVenta)
        : this.ultimaVenta,
    };
  }
}
