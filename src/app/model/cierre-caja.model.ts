import {
  CierreCajaInterface,
  CierreCajaTipoInterface,
} from "src/app/interfaces/caja.interface";
import { CierreCajaTipo } from "src/app/model/cierre-caja-tipo.model";
import { Utils } from "src/app/shared/utils.class";

export class CierreCaja {
  date: string = null;
  real: number = null;
  retirado: number = 0;
  saldoSiguienteCaja: number = null;

  constructor(
    public saldoInicial: number = null,
    public importeEfectivo: number = null,
    public salidasCaja: number = null,
    public saldoFinal: number = null,
    public tipos: CierreCajaTipo[] = []
  ) {
    this.date = Utils.getCurrentDate();
  }

  get diferencia(): number {
    if (this.real === null) {
      return 0;
    }
    return -1 * (this.saldoFinal - this.real);
  }

  get saldoSiguiente(): number {
    return this.saldoInicial + this.real - this.retirado;
  }

  fromInterface(cc: CierreCajaInterface): CierreCaja {
    this.saldoInicial = cc.saldoInicial;
    this.importeEfectivo = cc.importeEfectivo;
    this.salidasCaja = cc.salidasCaja;
    this.saldoFinal = cc.saldoFinal;
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
      retirado: this.retirado,
      tipos: this.tipos.map((cct: CierreCajaTipo): CierreCajaTipoInterface => {
        return cct.toInterface();
      }),
    };
  }
}
