import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@osumi/tools';

@Pipe({
  name: 'fixedNumber',
})
export default class FixedNumberPipe implements PipeTransform {
  transform(num: number): string {
    if (Number.isNaN(num)) {
      return '0,00';
    }
    return formatNumber(num);
  }
}
