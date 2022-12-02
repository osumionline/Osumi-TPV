export class IVAOption {
  id: string = null;
  name: string = "";
  value: number = -1;

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

  updateValues(iva: number, re: number) {
    this.iva = iva;
    this.re = re;
    if (this.tipoIVA === "iva") {
      this.name = this.iva + "%";
      this.value = this.iva;
    } else {
      this.name = this.iva + " + " + this.re + "%";
      this.value = this.iva + this.re;
    }
  }
}
