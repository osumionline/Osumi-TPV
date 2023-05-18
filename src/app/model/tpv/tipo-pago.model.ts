import { urldecode, urlencode } from "@osumi/tools";
import { TipoPagoInterface } from "src/app/interfaces/tipo-pago.interface";

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
    this.nombre = decode ? urldecode(tp.nombre) : tp.nombre;
    this.foto = tp.foto;
    this.afectaCaja = tp.afectaCaja;
    this.orden = tp.orden;
    this.fisico = tp.fisico;

    return this;
  }

  toInterface(encode: boolean = true): TipoPagoInterface {
    return {
      id: this.id,
      nombre: encode ? urlencode(this.nombre) : this.nombre,
      foto: this.foto,
      afectaCaja: this.afectaCaja,
      orden: this.orden,
      fisico: this.fisico,
    };
  }
}
