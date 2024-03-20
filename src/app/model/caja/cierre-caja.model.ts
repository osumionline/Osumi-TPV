import {
  CierreCajaInterface,
  CierreCajaTipoInterface,
} from "@interfaces/caja.interface";
import { CierreCajaTipo } from "@model/caja/cierre-caja-tipo.model";
import { getCurrentDate, urldecode } from "@osumi/tools";

export class CierreCaja {
  saldoSiguienteCaja: number = null;

  constructor(
    public date: string = null,
    public saldoInicial: number = null,
    public importeEfectivo: number = null,
    public salidasCaja: number = null,
    public saldoFinal: number = null,
    public real: number = null,
    public importe1c: number = null,
    public importe2c: number = null,
    public importe5c: number = null,
    public importe10c: number = null,
    public importe20c: number = null,
    public importe50c: number = null,
    public importe1: number = null,
    public importe2: number = null,
    public importe5: number = null,
    public importe10: number = null,
    public importe20: number = null,
    public importe50: number = null,
    public importe100: number = null,
    public importe200: number = null,
    public importe500: number = null,
    public retirado: number = null,
    public entrada: number = null,
    public tipos: CierreCajaTipo[] = []
  ) {
    this.date = getCurrentDate();
  }

  get diferencia(): number {
    if (this.real === null) {
      return 0;
    }
    return -1 * (this.saldoFinal - this.real - this.retirado);
  }

  get saldoSiguiente(): number {
    return this.real + this.entrada;
  }

  fromInterface(cc: CierreCajaInterface): CierreCaja {
    this.date = urldecode(this.date);
    this.saldoInicial = cc.saldoInicial;
    this.importeEfectivo = cc.importeEfectivo;
    this.salidasCaja = cc.salidasCaja;
    this.saldoFinal = cc.saldoFinal;
    this.real = cc.real;
    this.importe1c = cc.importe1c;
    this.importe2c = cc.importe2c;
    this.importe5c = cc.importe5c;
    this.importe10c = cc.importe10c;
    this.importe20c = cc.importe20c;
    this.importe50c = cc.importe50c;
    this.importe1 = cc.importe1;
    this.importe2 = cc.importe2;
    this.importe5 = cc.importe5;
    this.importe10 = cc.importe10;
    this.importe20 = cc.importe20;
    this.importe50 = cc.importe50;
    this.importe100 = cc.importe100;
    this.importe200 = cc.importe200;
    this.importe500 = cc.importe500;
    this.retirado = cc.retirado;
    this.entrada = cc.entrada;
    this.tipos = cc.tipos.map(
      (cct: CierreCajaTipoInterface): CierreCajaTipo => {
        return new CierreCajaTipo().fromInterface(cct);
      }
    );
    return this;
  }

  toInterface(): CierreCajaInterface {
    return {
      date: this.date,
      saldoInicial: this.saldoInicial,
      importeEfectivo: this.importeEfectivo,
      salidasCaja: this.salidasCaja,
      saldoFinal: this.saldoFinal,
      real: this.real,
      importe1c: this.importe1c,
      importe2c: this.importe2c,
      importe5c: this.importe5c,
      importe10c: this.importe10c,
      importe20c: this.importe20c,
      importe50c: this.importe50c,
      importe1: this.importe1,
      importe2: this.importe2,
      importe5: this.importe5,
      importe10: this.importe10,
      importe20: this.importe20,
      importe50: this.importe50,
      importe100: this.importe100,
      importe200: this.importe200,
      importe500: this.importe500,
      retirado: this.retirado,
      entrada: this.entrada,
      tipos: this.tipos.map((cct: CierreCajaTipo): CierreCajaTipoInterface => {
        return cct.toInterface();
      }),
    };
  }
}
