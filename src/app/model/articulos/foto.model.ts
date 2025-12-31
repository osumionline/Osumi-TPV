import { environment } from '@env/environment';
import { FotoInterface } from '@interfaces/articulo.interface';

export default class Foto {
  status: string = 'new';
  data: string | null = null;

  constructor(public id: number | null = null) {
    if (id !== null) {
      this.status = 'ok';
    }
  }

  load(str: string): void {
    this.status = 'new';
    this.data = str;
  }

  get url(): string | null {
    if (this.status === 'ok') {
      return environment.fotosUrl + this.id + '.webp';
    } else {
      return this.data;
    }
  }

  toInterface(): FotoInterface {
    return {
      status: this.status,
      id: this.id,
      data: this.data,
    };
  }
}
