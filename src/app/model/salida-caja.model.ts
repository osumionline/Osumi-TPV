import { SalidaCajaInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class SalidaCaja {
  constructor(
    public id: number = null,
    public concepto: string = null,
    public descripcion: string = null,
    public importe: number = null,
    public fecha: string = null
  ) {}

  fromInterface(sc: SalidaCajaInterface): SalidaCaja {
    this.id = sc.id;
    this.concepto = Utils.urldecode(sc.concepto);
    this.descripcion = Utils.urldecode(sc.descripcion);
    this.importe = sc.importe;
    this.fecha = Utils.urldecode(sc.fecha);

    return this;
  }

  toInterface(): SalidaCajaInterface {
    return {
      id: this.id,
      concepto: Utils.urlencode(this.concepto),
      descripcion: Utils.urlencode(this.descripcion),
      importe: this.importe,
      fecha: Utils.urlencode(this.fecha),
    };
  }
}
