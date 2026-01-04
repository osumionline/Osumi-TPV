import { environment } from '@env/environment';
import { FotoInterface } from '@interfaces/articulo.interface';
import ApiStatusEnum from '@model/enum/api-status.enum';

export default class Foto {
  status: string = ApiStatusEnum.NEW;
  data: string | null = null;

  constructor(public id: number | null = null) {
    if (id !== null) {
      this.status = ApiStatusEnum.OK;
    }
  }

  load(str: string): void {
    this.status = ApiStatusEnum.NEW;
    this.data = str;
  }

  get url(): string | null {
    if (this.status === ApiStatusEnum.OK) {
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
