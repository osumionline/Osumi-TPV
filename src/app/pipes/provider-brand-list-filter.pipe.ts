import { Pipe, PipeTransform } from "@angular/core";
import { SelectMarcaInterface } from "src/app/interfaces/interfaces";

@Pipe({
  name: "providerBrandListFilter",
})
export class ProviderBrandListFilterPipe implements PipeTransform {
  checkSort(a: SelectMarcaInterface, b: SelectMarcaInterface): number {
    return Number(b.selected) - Number(a.selected);
  }

  nameSort(a: SelectMarcaInterface, b: SelectMarcaInterface): number {
    return -(a.nombre < b.nombre) || +(a.nombre > b.nombre);
  }

  transform(
    list: SelectMarcaInterface[],
    filter: string
  ): SelectMarcaInterface[] {
    if (filter === "") {
      return list.sort(this.nameSort).sort(this.checkSort);
    }
    return list
      .filter((m: SelectMarcaInterface): boolean => {
        return m.nombre.toLowerCase().includes(filter);
      })
      .sort(this.nameSort)
      .sort(this.checkSort);
  }
}
