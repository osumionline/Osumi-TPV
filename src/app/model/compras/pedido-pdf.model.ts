import { PedidoPDFInterface } from '@interfaces/pedido.interface';
import { urldecode, urlencode } from '@osumi/tools';

export default class PedidoPDF {
  constructor(
    public id: number = null,
    public data: string = null,
    public nombre: string = null,
    public url: string = null,
    public deleted: boolean = false
  ) {}

  fromInterface(p: PedidoPDFInterface): PedidoPDF {
    this.id = p.id;
    this.data = p.data;
    this.nombre = urldecode(p.nombre);
    this.url = p.url;
    this.deleted = p.deleted;

    return this;
  }

  toInterface(): PedidoPDFInterface {
    return {
      id: this.id,
      data: this.data,
      nombre: urlencode(this.nombre),
      url: this.url,
      deleted: this.deleted,
    };
  }
}
