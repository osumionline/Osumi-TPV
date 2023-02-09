import { Pipe, PipeTransform } from "@angular/core";
import { Marca } from "src/app/model/marcas/marca.model";

@Pipe({
  name: "brandListFilter",
})
export class BrandListFilterPipe implements PipeTransform {
  transform(list: Marca[], filter: string): Marca[] {
    if (filter === "") {
      return list;
    }
    return list.filter((m: Marca): boolean => {
      return m.nombre.toLowerCase().includes(filter);
    });
  }
}
