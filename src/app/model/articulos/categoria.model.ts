import { CategoriaInterface } from '@interfaces/articulo.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class Categoria {
  constructor(
    public id: number = -1,
    public nombre: string = '',
    public profundidad: number = -1,
    public hijos: Categoria[] = []
  ) {}

  fromInterface(c: CategoriaInterface, hijos: Categoria[]): Categoria {
    this.id = c.id;
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
      nombre: urlencode(this.nombre),
      profundidad: this.profundidad,
      hijos: hijos,
    };
  }
}
