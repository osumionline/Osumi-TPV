import { EtiquetaWebInterface } from '@interfaces/articulo.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class EtiquetaWeb {
  constructor(
    public id: number | null = null,
    public texto: string | null = null,
    public slug: string | null = null
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
