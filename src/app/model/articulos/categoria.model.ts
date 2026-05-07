import { CategoriaInterface } from '@interfaces/articulo.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class Categoria {
  deployed: boolean = false;

  constructor(
    public id: number = -1,
    public idPadre: number | null = null,
    public nombre: string | null = null,
    public profundidad: number = -1,
    public hijos: Categoria[] = [],
  ) {}

  fromInterface(c: CategoriaInterface, hijos: Categoria[]): Categoria {
    this.id = c.id;
    this.idPadre = c.idPadre;
    this.nombre = urldecode(c.nombre);
    this.profundidad = c.profundidad;
    this.hijos = hijos;

    return this;
  }

  toInterface(): CategoriaInterface {
    const hijos: CategoriaInterface[] = [];
    for (const h of this.hijos) {
      hijos.push(h.toInterface());
    }
    return {
      id: this.id,
      idPadre: this.idPadre,
      nombre: urlencode(this.nombre),
      profundidad: this.profundidad,
      hijos: hijos,
    };
  }
}
