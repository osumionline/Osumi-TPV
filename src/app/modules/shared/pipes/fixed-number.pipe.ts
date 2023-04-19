import { Pipe, PipeTransform } from "@angular/core";
import { Utils } from "src/app/modules/shared/utils.class";

@Pipe({
  standalone: true,
  name: "fixedNumber",
})
export class FixedNumberPipe implements PipeTransform {
  transform(num: number): string {
    if (Number.isNaN(num)) {
      return "0,00";
    }
    return Utils.formatNumber(num);
  }
}
