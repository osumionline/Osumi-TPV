import { urldecode, urlencode } from "@osumi/tools";
import { EtiquetaInterface } from "src/app/interfaces/articulo.interface";

export class Etiqueta {
  constructor(
    public id: number = null,
    public texto: string = null,
    public slug: string = null
  ) {}

  fromInterface(e: EtiquetaInterface): Etiqueta {
    this.id = e.id;
    this.texto = urldecode(e.texto);
    this.slug = urldecode(e.slug);

    return this;
  }

  toInterface(): EtiquetaInterface {
    return {
      id: this.id,
      texto: urlencode(this.texto),
      slug: urlencode(this.slug),
    };
  }
}
