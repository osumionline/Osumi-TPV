import { Pipe, PipeTransform } from "@angular/core";
import { formatNumber } from "@osumi/tools";

@Pipe({
  standalone: true,
  name: "fixedNumber",
})
export class FixedNumberPipe implements PipeTransform {
  transform(num: number): string {
    if (Number.isNaN(num)) {
      return "0,00";
    }
    return formatNumber(num);
  }
}
