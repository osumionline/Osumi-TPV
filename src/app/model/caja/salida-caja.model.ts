import { SalidaCajaInterface } from "src/app/interfaces/caja.interface";
import { Utils } from "src/app/modules/shared/utils.class";

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
    this.concepto = decode ? Utils.urldecode(sc.concepto) : sc.concepto;
    this.descripcion = decode
      ? Utils.urldecode(sc.descripcion)
      : sc.descripcion;
    this.importe = sc.importe;
    this.fecha = decode ? Utils.urldecode(sc.fecha) : sc.fecha;
    this.editable = sc.editable;

    return this;
  }

  toInterface(encode: boolean = true): SalidaCajaInterface {
    return {
      id: this.id,
      concepto: encode ? Utils.urlencode(this.concepto) : this.concepto,
      descripcion: encode
        ? Utils.urlencode(this.descripcion)
        : this.descripcion,
      importe: this.importe,
      fecha: encode ? Utils.urlencode(this.fecha) : this.fecha,
      editable: this.editable,
    };
  }
}
