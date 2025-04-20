import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixedNumber',
})
export default class FixedNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }

    const fixed: string = value.toFixed(2);
    const [intPart, decPart] = fixed.split('.');

    const intWithThousands: string = intPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.'
    );

    if (decPart === '00') {
      return intWithThousands;
    }

    return `${intWithThousands},${decPart}`;
  }
}
