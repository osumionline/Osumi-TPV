import {
  CierreCajaInterface,
  CierreCajaTipoInterface,
} from "src/app/interfaces/interfaces";
import { CierreCajaTipo } from "src/app/model/cierre-caja-tipo.model";
import { Utils } from "src/app/shared/utils.class";

export class CierreCaja {
  date: string = null;
  real: number = null;

  constructor(
    public saldoInicial: number = null,
    public importeEfectivo: number = null,
    public importeTotal: number = null,
    public tipos: CierreCajaTipo[] = []
  ) {
    this.date = Utils.getCurrentDate();
  }

  get diferencia(): number {
    if (this.real === null) {
      return 0;
    }
    return -1 * (this.importeTotal - this.real);
  }

  fromInterface(cc: CierreCajaInterface): CierreCaja {
    this.saldoInicial = cc.saldoInicial;
    this.importeEfectivo = cc.importeEfectivo;
    this.importeTotal = cc.importeTotal;
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
      importeTotal: this.importeTotal,
      real: this.real,
      tipos: this.tipos.map((cct: CierreCajaTipo): CierreCajaTipoInterface => {
        return cct.toInterface();
      }),
    };
  }
}
