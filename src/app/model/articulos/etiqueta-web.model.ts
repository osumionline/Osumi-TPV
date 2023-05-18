import { urldecode, urlencode } from "@osumi/tools";
import { EtiquetaWebInterface } from "src/app/interfaces/articulo.interface";

export class EtiquetaWeb {
  constructor(
    public id: number = null,
    public texto: string = null,
    public slug: string = null
  ) {}

  fromInterface(e: EtiquetaWebInterface): EtiquetaWeb {
    this.id = e.id;
    this.texto = urldecode(e.texto);
    this.slug = urldecode(e.slug);

    return this;
  }

  toInterface(): EtiquetaWebInterface {
    return {
      id: this.id,
      texto: urlencode(this.texto),
      slug: urlencode(this.slug),
    };
  }
}
