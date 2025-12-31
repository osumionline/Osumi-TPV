import {
  InformeMensualItemInterface,
  InformeMensualItemOtrosInterface,
} from '@interfaces/informes.interface';
import { formatNumber, urldecode, urlencode } from '@osumi/tools';

export default class InformeMensualItem {
  constructor(
    public num: number | null = null,
    public weekDay: string | null = null,
    public minTicket: number | null = null,
    public maxTicket: number | null = null,
    public efectivo: number | null = null,
    public otros: InformeMensualItemOtrosInterface[] = [],
    public totalDia: number | null = null,
    public suma: number | null = null
  ) {}

  get fecha(): string {
    return this.num + ' ' + this.weekDay;
  }

  get tickets(): string {
    if (this.minTicket === null && this.maxTicket === null) {
      return '------';
    }
    return this.minTicket + ' - ' + this.maxTicket;
  }

  getOtros(key: string): string {
    if (this.minTicket === null && this.maxTicket === null) {
      return '------';
    }
    const ind: number = this.otros.findIndex((x: InformeMensualItemOtrosInterface): boolean => {
      return x.nombre === key;
    });
    if (ind === -1) {
      return formatNumber(0) + ' €';
    }
    return formatNumber(this.otros[ind].valor) + ' €';
  }

  getOtrosValue(key: string): number | null {
    if (this.minTicket === null && this.maxTicket === null) {
      return null;
    }
    const ind: number = this.otros.findIndex((x: InformeMensualItemOtrosInterface): boolean => {
      return x.nombre === key;
    });
    if (ind === -1) {
      return 0;
    }
    return this.otros[ind].valor;
  }

  fromInterface(imi: InformeMensualItemInterface): InformeMensualItem {
    this.num = imi.num;
    this.weekDay = urldecode(imi.weekDay);
    this.minTicket = imi.minTicket;
    this.maxTicket = imi.maxTicket;
    this.efectivo = imi.efectivo;
    this.otros = imi.otros;
    this.totalDia = imi.totalDia;
    this.suma = imi.suma;

    return this;
  }

  toInterface(): InformeMensualItemInterface {
    return {
      num: this.num,
      weekDay: urlencode(this.weekDay),
      minTicket: this.minTicket,
      maxTicket: this.maxTicket,
      efectivo: this.efectivo,
      otros: this.otros,
      totalDia: this.totalDia,
      suma: this.suma,
    };
  }
}
