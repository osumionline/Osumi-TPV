import { ClienteInterface } from '@interfaces/cliente.interface';
import ArticuloTopVenta from '@model/articulos/articulo-top-venta.model';
import ArticuloUltimaVenta from '@model/articulos/articulo-ultima-venta.model';
import Factura from '@model/clientes/factura.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Cliente {
  ultimasVentas: ArticuloUltimaVenta[] = [];
  topVentas: ArticuloTopVenta[] = [];
  facturas: Factura[] = [];

  constructor(
    public id: number | null = null,
    public nombreApellidos: string | null = null,
    public dniCif: string | null = null,
    public telefono: string | null = null,
    public email: string | null = null,
    public direccion: string | null = null,
    public codigoPostal: string | null = null,
    public poblacion: string | null = null,
    public provincia: number | null = null,
    public factIgual: boolean = true,
    public factNombreApellidos: string | null = null,
    public factDniCif: string | null = null,
    public factTelefono: string | null = null,
    public factEmail: string | null = null,
    public factDireccion: string | null = null,
    public factCodigoPostal: string | null = null,
    public factPoblacion: string | null = null,
    public factProvincia: number | null = null,
    public observaciones: string | null = null,
    public descuento: number = 0,
    public ultimaVenta: string | null = null
  ) {}

  fromInterface(c: ClienteInterface, decode: boolean = true): Cliente {
    this.id = c.id;
    this.nombreApellidos = decode ? urldecode(c.nombreApellidos) : c.nombreApellidos;
    this.dniCif = decode ? urldecode(c.dniCif) : c.dniCif;
    this.telefono = decode ? urldecode(c.telefono) : c.telefono;
    this.email = decode ? urldecode(c.email) : c.email;
    this.direccion = decode ? urldecode(c.direccion) : c.direccion;
    this.codigoPostal = decode ? urldecode(c.codigoPostal) : c.codigoPostal;
    this.poblacion = decode ? urldecode(c.poblacion) : c.poblacion;
    this.provincia = c.provincia;
    this.factIgual = c.factIgual;
    this.factNombreApellidos = decode ? urldecode(c.factNombreApellidos) : c.factNombreApellidos;
    this.factDniCif = decode ? urldecode(c.factDniCif) : c.factDniCif;
    this.factTelefono = decode ? urldecode(c.factTelefono) : c.factTelefono;
    this.factEmail = decode ? urldecode(c.factEmail) : c.factEmail;
    this.factDireccion = decode ? urldecode(c.factDireccion) : c.factDireccion;
    this.factCodigoPostal = decode ? urldecode(c.factCodigoPostal) : c.factCodigoPostal;
    this.factPoblacion = decode ? urldecode(c.factPoblacion) : c.factPoblacion;
    this.factProvincia = c.factProvincia;
    this.observaciones = decode ? urldecode(c.observaciones) : c.observaciones;
    this.descuento = c.descuento;
    this.ultimaVenta = decode ? urldecode(c.ultimaVenta) : c.ultimaVenta;

    return this;
  }

  toInterface(encode: boolean = true): ClienteInterface {
    return {
      id: this.id,
      nombreApellidos: encode ? urlencode(this.nombreApellidos) : this.nombreApellidos,
      dniCif: encode ? urlencode(this.dniCif) : this.dniCif,
      telefono: encode ? urlencode(this.telefono) : this.telefono,
      email: encode ? urlencode(this.email) : this.email,
      direccion: encode ? urlencode(this.direccion) : this.direccion,
      codigoPostal: encode ? urlencode(this.codigoPostal) : this.codigoPostal,
      poblacion: encode ? urlencode(this.poblacion) : this.poblacion,
      provincia: this.provincia,
      factIgual: this.factIgual,
      factNombreApellidos: encode ? urlencode(this.factNombreApellidos) : this.factNombreApellidos,
      factDniCif: encode ? urlencode(this.factDniCif) : this.factDniCif,
      factTelefono: encode ? urlencode(this.factTelefono) : this.factTelefono,
      factEmail: encode ? urlencode(this.factEmail) : this.factEmail,
      factDireccion: encode ? urlencode(this.factDireccion) : this.factDireccion,
      factCodigoPostal: encode ? urlencode(this.factCodigoPostal) : this.factCodigoPostal,
      factPoblacion: encode ? urlencode(this.factPoblacion) : this.factPoblacion,
      factProvincia: this.factProvincia,
      observaciones: encode ? urlencode(this.observaciones) : this.observaciones,
      descuento: this.descuento,
      ultimaVenta: encode ? urlencode(this.ultimaVenta) : this.ultimaVenta,
    };
  }
}
