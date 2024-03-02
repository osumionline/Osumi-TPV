import {
  AfterViewInit,
  Component,
  ModelSignal,
  ViewChild,
  model,
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import {
  HistoricoArticuloBuscadorInterface,
  HistoricoArticuloResult,
} from "src/app/interfaces/articulo.interface";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { HistoricoArticulo } from "src/app/model/articulos/historico-articulo.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";

@Component({
  selector: "otpv-un-articulo-historico",
  standalone: true,
  imports: [MatTableModule, MatSort, MatPaginator, FixedNumberPipe],
  templateUrl: "./un-articulo-historico.component.html",
  styleUrl: "../un-articulo/un-articulo.component.scss",
})
export class UnArticuloHistoricoComponent implements AfterViewInit {
  articulo: ModelSignal<Articulo> = model.required<Articulo>();
  historicoArticuloDataSource: MatTableDataSource<HistoricoArticulo> =
    new MatTableDataSource<HistoricoArticulo>();
  @ViewChild(MatSort) sort: MatSort;

  historicoArticuloBuscador: HistoricoArticuloBuscadorInterface = {
    id: null,
    orderBy: "createdAt",
    orderSent: "desc",
    pagina: 1,
    num: 20,
  };
  historicoArticulo: HistoricoArticulo[] = [];
  historicoArticuloPags: number = 0;
  historicoArticuloDisplayedColumns: string[] = [
    "createdAt",
    "tipo",
    "stockPrevio",
    "diferencia",
    "stockFinal",
    "puc",
    "pvp",
    "idVenta",
    "idPedido",
  ];

  constructor(private ars: ArticulosService, private cms: ClassMapperService) {}

  ngAfterViewInit(): void {
    this.historicoArticuloDataSource.sort = this.sort;
  }

  loadHistorico(): void {
    this.historicoArticuloBuscador.id = this.articulo().id;
    this.ars
      .getHistoricoArticulo(this.historicoArticuloBuscador)
      .subscribe((result: HistoricoArticuloResult): void => {
        this.historicoArticuloPags = result.pags;
        this.historicoArticulo = this.cms.getHistoricoArticulos(result.list);
        this.historicoArticuloDataSource.data = this.historicoArticulo;
      });
  }

  cambiarOrdenHistoricoArticulo(sort: Sort): void {
    if (sort.direction === "") {
      this.historicoArticuloBuscador.orderBy = null;
      this.historicoArticuloBuscador.orderSent = null;
    } else {
      this.historicoArticuloBuscador.orderBy = sort.active;
      this.historicoArticuloBuscador.orderSent = sort.direction;
    }
    this.loadHistorico();
  }

  changePageHistoricoArticulo(ev: PageEvent): void {
    this.historicoArticuloBuscador.pagina = ev.pageIndex + 1;
    this.historicoArticuloBuscador.num = ev.pageSize;
    this.loadHistorico();
  }
}
