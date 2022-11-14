import { TipoPagoInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class TipoPago {
  constructor(
    public id: number = null,
    public nombre: string = null,
    public foto: string = null,
    public afectaCaja: boolean = false,
    public orden: number = null,
    public fisico: boolean = true
  ) {}

  fromInterface(tp: TipoPagoInterface, decode: boolean = true): TipoPago {
    this.id = tp.id;
    this.nombre = decode ? Utils.urldecode(tp.nombre) : tp.nombre;
    this.foto = tp.foto;
    this.afectaCaja = tp.afectaCaja;
    this.orden = tp.orden;
    this.fisico = tp.fisico;

    return this;
  }

  toInterface(encode: boolean = true): TipoPagoInterface {
    return {
      id: this.id,
      nombre: encode ? Utils.urlencode(this.nombre) : this.nombre,
      foto: this.foto,
      afectaCaja: this.afectaCaja,
      orden: this.orden,
      fisico: this.fisico,
    };
  }
}
