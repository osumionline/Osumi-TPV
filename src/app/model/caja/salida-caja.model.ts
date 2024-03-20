import { SalidaCajaInterface } from "@interfaces/caja.interface";
import { urldecode, urlencode } from "@osumi/tools";

export class SalidaCaja {
  constructor(
    public id: number = null,
    public concepto: string = null,
    public descripcion: string = null,
    public importe: number = null,
    public fecha: string = null,
    public editable: boolean = true
  ) {}

  fromInterface(sc: SalidaCajaInterface, decode: boolean = true): SalidaCaja {
    this.id = sc.id;
    this.concepto = decode ? urldecode(sc.concepto) : sc.concepto;
    this.descripcion = decode ? urldecode(sc.descripcion) : sc.descripcion;
    this.importe = sc.importe;
    this.fecha = decode ? urldecode(sc.fecha) : sc.fecha;
    this.editable = sc.editable;

    return this;
  }

  toInterface(encode: boolean = true): SalidaCajaInterface {
    return {
      id: this.id,
      concepto: encode ? urlencode(this.concepto) : this.concepto,
      descripcion: encode ? urlencode(this.descripcion) : this.descripcion,
      importe: this.importe,
      fecha: encode ? urlencode(this.fecha) : this.fecha,
      editable: this.editable,
    };
  }
}
