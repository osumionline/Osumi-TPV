import {
  CierreCajaInterface,
  CierreCajaTipoInterface,
} from "src/app/interfaces/interfaces";
import { CierreCajaTipo } from "src/app/model/cierre-caja-tipo.model";

export class CierreCaja {
  constructor(
    public saldoInicial: number = null,
    public importeEfectivo: number = null,
    public importeTotal: number = null,
    public tipos: CierreCajaTipo[] = []
  ) {}

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
      saldoInicial: this.saldoInicial,
      importeEfectivo: this.importeEfectivo,
      importeTotal: this.importeTotal,
      tipos: this.tipos.map((cct: CierreCajaTipo): CierreCajaTipoInterface => {
        return cct.toInterface();
      }),
    };
  }
}
