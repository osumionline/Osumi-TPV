import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixedNumber'
})
export class FixedNumberPipe implements PipeTransform {
  transform(num: number): string {
    return num.toFixed(2);
  }
}
