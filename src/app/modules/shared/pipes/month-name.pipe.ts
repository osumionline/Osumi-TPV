import { inject, Pipe, PipeTransform } from '@angular/core';
import { Month } from '@app/interfaces/interfaces';
import ConfigService from '@services/config.service';

@Pipe({
  name: 'monthName',
})
export default class MonthNamePipe implements PipeTransform {
  private config: ConfigService = inject(ConfigService);

  transform(value: number): string {
    const month: Month = this.config.monthList.find(
      (m: Month): boolean => m.id === value
    );
    return month.name;
  }
}
