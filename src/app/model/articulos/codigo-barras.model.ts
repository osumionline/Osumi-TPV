import { CodigoBarrasInterface } from '@interfaces/articulo.interface';

export default class CodigoBarras {
  constructor(
    public id: number | null = null,
    public codigoBarras: string | null = null,
    public porDefecto: boolean = false
  ) {}

  fromInterface(cb: CodigoBarrasInterface): CodigoBarras {
    this.id = cb.id;
    this.codigoBarras = cb.codigoBarras;
    this.porDefecto = cb.porDefecto;

    return this;
  }

  toInterface(): CodigoBarrasInterface {
    return {
      id: this.id,
      codigoBarras: this.codigoBarras,
      porDefecto: this.porDefecto,
    };
  }
}
