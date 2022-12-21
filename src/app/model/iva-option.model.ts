export class IVAOption {
  id: string = null;
  _value: number = -1;

  constructor(
    public tipoIVA: string = "iva",
    public iva: number = -1,
    public re: number = -1
  ) {
    if (iva !== -1 || re !== -1) {
      this.id = tipoIVA + "_" + iva + "_" + re;
    }
    this.updateValues(iva, re);
  }

  updateTipoIva(tipoIVA: string): void {
    this.tipoIVA = tipoIVA;
    if (this.iva !== -1 || this.re !== -1) {
      this.id = this.tipoIVA + "_" + this.iva + "_" + this.re;
    }
  }

  get name(): string {
    if (this.tipoIVA === "iva") {
      return this.iva + "%";
    } else {
      return this.iva + " + " + this.re + "%";
    }
  }

  get value(): number {
    if (this.tipoIVA === "iva") {
      return this.iva;
    } else {
      return this.iva + this.re;
    }
  }

  updateValues(iva: number, re: number): void {
    this.iva = iva;
    this.re = re;
  }
}
