import { VentaFinInterface, VentaLineaInterface } from '@interfaces/venta.interface';
import VentaLinea from '@model/ventas/venta-linea.model';
import { toNumber, urldecode, urlencode } from '@osumi/tools';

export default class VentaFin {
  pagoMixto: boolean = false;

  constructor(
    public efectivo: string = '0',
    public cambio: string = '0',
    public tarjeta: string = '0',
    public idEmpleado: number | null = null,
    public idTipoPago: number | null = null,
    public idCliente: number | null = null,
    public total: string = '0',
    public lineas: VentaLinea[] = [],
    public imprimir: string | null = 'si',
    public email: string | null = null
  ) {}

  fromInterface(vf: VentaFinInterface): VentaFin {
    this.efectivo = vf.efectivo !== null ? vf.efectivo.toString() : '0';
    this.cambio = vf.cambio !== null ? vf.cambio.toString() : '0';
    this.tarjeta = vf.tarjeta !== null ? vf.tarjeta.toString() : '0';
    this.idEmpleado = vf.idEmpleado;
    this.idTipoPago = vf.idTipoPago;
    this.idCliente = vf.idCliente;
    this.total = vf.total.toString();
    this.lineas = vf.lineas.map((l: VentaLineaInterface): VentaLinea => {
      return new VentaLinea().fromInterface(l);
    });
    this.imprimir = urldecode(vf.imprimir);
    this.email = urldecode(vf.email);

    return this;
  }

  toInterface(): VentaFinInterface {
    return {
      efectivo: this.efectivo !== null ? toNumber(this.efectivo) : 0,
      cambio: this.cambio !== null ? toNumber(this.cambio) : 0,
      tarjeta: this.tarjeta !== null ? toNumber(this.tarjeta) : 0,
      idEmpleado: this.idEmpleado,
      idTipoPago: this.idTipoPago,
      idCliente: this.idCliente,
      total: toNumber(this.total),
      lineas: this.lineas.map((l: VentaLinea): VentaLineaInterface => {
        return l.toInterface();
      }),
      pagoMixto: this.pagoMixto,
      imprimir: urlencode(this.imprimir),
      email: urlencode(this.email),
    };
  }
}
