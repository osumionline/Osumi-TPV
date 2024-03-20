import { VentaHistoricoInterface } from "@interfaces/caja.interface";
import {
  FacturaInterface,
  FacturaSaveInterface,
} from "@interfaces/cliente.interface";
import { VentaHistorico } from "@model/caja/venta-historico.model";
import { urldecode, urlencode } from "@osumi/tools";

export class Factura {
  constructor(
    public id: number = null,
    public idCliente: number = null,
    public numFactura: number = null,
    public nombreApellidos: string = null,
    public dniCif: string = null,
    public telefono: string = null,
    public email: string = null,
    public direccion: string = null,
    public codigoPostal: string = null,
    public poblacion: string = null,
    public provincia: number = null,
    public importe: number = null,
    public impresa: boolean = false,
    public fecha: string = null,
    public ventas: VentaHistorico[] = []
  ) {}

  get soloFecha(): string {
    if (this.fecha === null) {
      return "";
    }
    const partes: string[] = this.fecha.split(" ");
    return partes[0];
  }

  get year(): string {
    if (this.fecha === null) {
      return "";
    }
    const partes: string[] = this.soloFecha.split("/");
    return partes[2];
  }

  fromInterface(f: FacturaInterface): Factura {
    this.id = f.id;
    this.idCliente = f.idCliente;
    this.numFactura = f.numFactura;
    this.nombreApellidos = urldecode(f.nombreApellidos);
    this.dniCif = urldecode(f.dniCif);
    this.telefono = urldecode(f.telefono);
    this.email = urldecode(f.email);
    this.direccion = urldecode(f.direccion);
    this.codigoPostal = urldecode(f.codigoPostal);
    this.poblacion = urldecode(f.poblacion);
    this.provincia = f.provincia;
    this.importe = f.importe;
    this.impresa = f.impresa;
    this.fecha = f.fecha;
    this.ventas = f.ventas.map((v: VentaHistoricoInterface): VentaHistorico => {
      return new VentaHistorico().fromInterface(v);
    });

    return this;
  }

  toInterface(): FacturaInterface {
    return {
      id: this.id,
      idCliente: this.idCliente,
      numFactura: this.numFactura,
      nombreApellidos: urlencode(this.nombreApellidos),
      dniCif: urlencode(this.dniCif),
      telefono: urlencode(this.telefono),
      email: urlencode(this.email),
      direccion: urlencode(this.direccion),
      codigoPostal: urlencode(this.codigoPostal),
      poblacion: urlencode(this.poblacion),
      provincia: this.provincia,
      importe: this.importe,
      impresa: this.impresa,
      fecha: urlencode(this.fecha),
      ventas: this.ventas.map((v: VentaHistorico): VentaHistoricoInterface => {
        return v.toInterface();
      }),
    };
  }

  toSaveInterface(imprimir: boolean = false): FacturaSaveInterface {
    return {
      id: this.id,
      idCliente: this.idCliente,
      ventas: this.ventas.map((v: VentaHistorico): number => {
        return v.id;
      }),
      imprimir: imprimir,
    };
  }
}
