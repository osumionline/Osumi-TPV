import { AccesoDirectoInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class AccesoDirecto {
  constructor(
    public id: number = null,
    public accesoDirecto: number = null,
    public nombre: string = null
  ) {}

  fromInterface(ad: AccesoDirectoInterface): AccesoDirecto {
    this.id = ad.id;
    this.accesoDirecto = ad.accesoDirecto;
    this.nombre = Utils.urldecode(ad.nombre);

    return this;
  }

  toInterface(): AccesoDirectoInterface {
    return {
      id: this.id,
      accesoDirecto: this.accesoDirecto,
      nombre: Utils.urlencode(this.nombre),
    };
  }
}
