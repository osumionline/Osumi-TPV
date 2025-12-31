import { Pipe, PipeTransform } from '@angular/core';
import TipoPago from '@model/tpv/tipo-pago.model';

@Pipe({
  name: 'payTypeListFilter',
})
export default class PayTypeListFilterPipe implements PipeTransform {
  transform(list: TipoPago[], filter: string): TipoPago[] {
    if (filter === '') {
      return list;
    }
    return list.filter((tp: TipoPago): boolean => {
      if (tp.nombre === null) {
        return false;
      }
      return tp.nombre.toLowerCase().includes(filter);
    });
  }
}
