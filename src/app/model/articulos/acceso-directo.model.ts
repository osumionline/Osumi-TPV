import { AccesoDirectoInterface } from '@interfaces/articulo.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class AccesoDirecto {
  constructor(
    public id: number | null = null,
    public accesoDirecto: number | null = null,
    public nombre: string | null = null
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
