import { Pipe, PipeTransform } from '@angular/core';
import Marca from '@model/marcas/marca.model';

@Pipe({
  name: 'brandListFilter',
})
export default class BrandListFilterPipe implements PipeTransform {
  transform(list: Marca[], filter: string): Marca[] {
    if (filter === '') {
      return list;
    }
    return list.filter((m: Marca): boolean => {
      if (m.nombre === null) {
        return false;
      }
      return m.nombre.toLowerCase().includes(filter);
    });
  }
}
