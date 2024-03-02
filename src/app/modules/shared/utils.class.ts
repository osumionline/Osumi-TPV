export class Utils {
  static setTwoNumberDecimal(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    target.value =
      target.value != ""
        ? parseFloat(target.value.replace(",", ".")).toFixed(2)
        : "0.00";
  }
}
