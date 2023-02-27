import { Pipe, PipeTransform } from "@angular/core";
import { Empleado } from "src/app/model/tpv/empleado.model";

@Pipe({
  standalone: true,
  name: "employeeListFilter",
})
export class EmployeeListFilterPipe implements PipeTransform {
  transform(list: Empleado[], filter: string): Empleado[] {
    if (filter === "") {
      return list;
    }
    return list.filter((e: Empleado): boolean => {
      return e.nombre.toLowerCase().includes(filter);
    });
  }
}