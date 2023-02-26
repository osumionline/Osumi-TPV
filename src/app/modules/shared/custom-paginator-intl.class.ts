import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes: Subject<void> = new Subject<void>();

  firstPageLabel: string = "Primera página";
  itemsPerPageLabel: string = "Resultados por página:";
  lastPageLabel: string = "Última página";

  nextPageLabel: string = "Siguiente página";
  previousPageLabel: string = "Página anterior";

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages: number = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}
