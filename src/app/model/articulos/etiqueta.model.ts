import { EtiquetaInterface } from '@interfaces/articulo.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class Etiqueta {
  constructor(
    public id: number | null = null,
    public texto: string | null = null,
    public slug: string | null = null
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
