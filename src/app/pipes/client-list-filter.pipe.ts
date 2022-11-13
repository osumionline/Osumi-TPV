import { Pipe, PipeTransform } from "@angular/core";
import { Cliente } from "src/app/model/cliente.model";

@Pipe({
  name: "clientListFilter",
})
export class ClientListFilterPipe implements PipeTransform {
  transform(list: Cliente[], filter: string): Cliente[] {
    if (filter === "") {
      return list;
    }
    return list.filter((c: Cliente): boolean => {
      return c.nombreApellidos.toLowerCase().includes(filter);
    });
  }
}
