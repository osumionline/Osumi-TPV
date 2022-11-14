import { Pipe, PipeTransform } from "@angular/core";
import { TipoPago } from "src/app/model/tipo-pago.model";

@Pipe({
  name: "payTypeListFilter",
})
export class PayTypeListFilterPipe implements PipeTransform {
  transform(list: TipoPago[], filter: string): TipoPago[] {
    if (filter === "") {
      return list;
    }
    return list.filter((tp: TipoPago): boolean => {
      return tp.nombre.toLowerCase().includes(filter);
    });
  }
}
