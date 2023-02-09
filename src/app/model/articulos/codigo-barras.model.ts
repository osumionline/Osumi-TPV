import { CodigoBarrasInterface } from "src/app/interfaces/articulo.interface";

export class CodigoBarras {
  constructor(
    public id: number = null,
    public codigoBarras: string = null,
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
