import { Pipe, PipeTransform } from '@angular/core';
import Empleado from '@model/tpv/empleado.model';

@Pipe({
  name: 'employeeListFilter',
})
export default class EmployeeListFilterPipe implements PipeTransform {
  transform(list: Empleado[], filter: string): Empleado[] {
    if (filter === '') {
      return list;
    }
    return list.filter((e: Empleado): boolean => {
      if (e.nombre === null) {
        return false;
      }
      return e.nombre.toLowerCase().includes(filter);
    });
  }
}
