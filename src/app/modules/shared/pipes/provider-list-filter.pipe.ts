import { Pipe, PipeTransform } from '@angular/core';
import Proveedor from '@model/proveedores/proveedor.model';

@Pipe({
  name: 'providerListFilter',
})
export default class ProviderListFilterPipe implements PipeTransform {
  transform(list: Proveedor[], filter: string): Proveedor[] {
    if (filter === '') {
      return list;
    }
    return list.filter((p: Proveedor): boolean => {
      if (p.nombre === null) {
        return false;
      }
      return p.nombre.toLowerCase().includes(filter);
    });
  }
}
