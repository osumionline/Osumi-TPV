import { EtiquetaInterface } from "src/app/interfaces/articulo.interface";
import { Utils } from "src/app/modules/shared/utils.class";

export class Etiqueta {
  constructor(
    public id: number = null,
    public texto: string = null,
    public slug: string = null
  ) {}

  fromInterface(e: EtiquetaInterface): Etiqueta {
    this.id = e.id;
    this.texto = Utils.urldecode(e.texto);
    this.slug = Utils.urldecode(e.slug);

    return this;
  }

  toInterface(): EtiquetaInterface {
    return {
      id: this.id,
      texto: Utils.urlencode(this.texto),
      slug: Utils.urlencode(this.slug),
    };
  }
}
