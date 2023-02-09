import { EtiquetaWebInterface } from "src/app/interfaces/articulo.interface";
import { Utils } from "src/app/shared/utils.class";

export class EtiquetaWeb {
  constructor(
    public id: number = null,
    public texto: string = null,
    public slug: string = null
  ) {}

  fromInterface(e: EtiquetaWebInterface): EtiquetaWeb {
    this.id = e.id;
    this.texto = Utils.urldecode(e.texto);
    this.slug = Utils.urldecode(e.slug);

    return this;
  }

  toInterface(): EtiquetaWebInterface {
    return {
      id: this.id,
      texto: Utils.urlencode(this.texto),
      slug: Utils.urlencode(this.slug),
    };
  }
}
