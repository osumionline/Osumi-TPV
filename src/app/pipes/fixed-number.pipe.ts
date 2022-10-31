import { Pipe, PipeTransform } from "@angular/core";
import { Utils } from "src/app/shared/utils.class";

@Pipe({
  name: "fixedNumber",
})
export class FixedNumberPipe implements PipeTransform {
  transform(num: number): string {
    return Utils.formatNumber(num);
  }
}
