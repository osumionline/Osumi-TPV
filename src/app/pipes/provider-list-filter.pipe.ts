import { Pipe, PipeTransform } from "@angular/core";
import { Proveedor } from "src/app/model/proveedor.model";

@Pipe({
  name: "providerListFilter",
})
export class ProviderListFilterPipe implements PipeTransform {
  transform(list: Proveedor[], filter: string): Proveedor[] {
    if (filter === "") {
      return list;
    }
    return list.filter((p: Proveedor): boolean => {
      return p.nombre.toLowerCase().includes(filter);
    });
  }
}
