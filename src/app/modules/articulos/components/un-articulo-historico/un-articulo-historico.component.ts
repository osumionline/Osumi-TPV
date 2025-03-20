import {
  AfterViewInit,
  Component,
  ModelSignal,
  Signal,
  inject,
  model,
  viewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  HistoricoArticuloBuscadorInterface,
  HistoricoArticuloResult,
} from '@interfaces/articulo.interface';
import Articulo from '@model/articulos/articulo.model';
import HistoricoArticulo from '@model/articulos/historico-articulo.model';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-un-articulo-historico',
  imports: [
    MatTableModule,
    MatSort,
    MatSortHeader,
    MatPaginator,
    FixedNumberPipe,
  ],
  templateUrl: './un-articulo-historico.component.html',
  styleUrl: '../un-articulo/un-articulo.component.scss',
})
export default class UnArticuloHistoricoComponent implements AfterViewInit {
  private ars: ArticulosService = inject(ArticulosService);
  private cms: ClassMapperService = inject(ClassMapperService);

  articulo: ModelSignal<Articulo> = model.required<Articulo>();
  historicoArticuloDataSource: MatTableDataSource<HistoricoArticulo> =
    new MatTableDataSource<HistoricoArticulo>();
  sort: Signal<MatSort> = viewChild(MatSort);

  historicoArticuloBuscador: HistoricoArticuloBuscadorInterface = {
    id: null,
    orderBy: 'createdAt',
    orderSent: 'desc',
    pagina: 1,
    num: 20,
  };
  historicoArticulo: HistoricoArticulo[] = [];
  historicoArticuloPags: number = 0;
  historicoArticuloDisplayedColumns: string[] = [
    'createdAt',
    'tipo',
    'stockPrevio',
    'diferencia',
    'stockFinal',
    'puc',
    'pvp',
    'idVenta',
    'idPedido',
  ];

  ngAfterViewInit(): void {
    this.historicoArticuloDataSource.sort = this.sort();
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
    if (sort.direction === '') {
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
