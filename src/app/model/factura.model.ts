import { VentaHistoricoInterface } from "src/app/interfaces/caja.interface";
import {
  FacturaInterface,
  FacturaSaveInterface,
} from "src/app/interfaces/cliente.interface";
import { VentaHistorico } from "src/app/model/venta-historico.model";
import { Utils } from "src/app/shared/utils.class";

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

  fromInterface(f: FacturaInterface): Factura {
    this.id = f.id;
    this.idCliente = f.idCliente;
    this.numFactura = f.numFactura;
    this.nombreApellidos = Utils.urldecode(f.nombreApellidos);
    this.dniCif = Utils.urldecode(f.dniCif);
    this.telefono = Utils.urldecode(f.telefono);
    this.email = Utils.urldecode(f.email);
    this.direccion = Utils.urldecode(f.direccion);
    this.codigoPostal = Utils.urldecode(f.codigoPostal);
    this.poblacion = Utils.urldecode(f.poblacion);
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
      nombreApellidos: Utils.urlencode(this.nombreApellidos),
      dniCif: Utils.urlencode(this.dniCif),
      telefono: Utils.urlencode(this.telefono),
      email: Utils.urlencode(this.email),
      direccion: Utils.urlencode(this.direccion),
      codigoPostal: Utils.urlencode(this.codigoPostal),
      poblacion: Utils.urlencode(this.poblacion),
      provincia: this.provincia,
      importe: this.importe,
      impresa: this.impresa,
      fecha: Utils.urlencode(this.fecha),
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
