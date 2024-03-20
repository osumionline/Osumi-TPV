import { AccesoDirectoInterface } from "@interfaces/articulo.interface";
import { urldecode, urlencode } from "@osumi/tools";

export class AccesoDirecto {
  constructor(
    public id: number = null,
    public accesoDirecto: number = null,
    public nombre: string = null
  ) {}

  fromInterface(ad: AccesoDirectoInterface): AccesoDirecto {
    this.id = ad.id;
    this.accesoDirecto = ad.accesoDirecto;
    this.nombre = urldecode(ad.nombre);

    return this;
  }

  toInterface(): AccesoDirectoInterface {
    return {
      id: this.id,
      accesoDirecto: this.accesoDirecto,
      nombre: urlencode(this.nombre),
    };
  }
}
