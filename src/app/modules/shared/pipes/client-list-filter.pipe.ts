import { Pipe, PipeTransform } from '@angular/core';
import Cliente from '@model/clientes/cliente.model';

@Pipe({
  standalone: true,
  name: 'clientListFilter',
})
export default class ClientListFilterPipe implements PipeTransform {
  transform(list: Cliente[], filter: string): Cliente[] {
    if (filter === '') {
      return list;
    }
    return list.filter((c: Cliente): boolean => {
      return c.nombreApellidos.toLowerCase().includes(filter);
    });
  }
}
