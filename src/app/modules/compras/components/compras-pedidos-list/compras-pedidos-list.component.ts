import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { disabled, Field, form, min } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import {
  PedidosAllResult,
  PedidosFilterInterface,
  PedidosResult,
} from '@interfaces/pedido.interface';
import Pedido from '@model/compras/pedido.model';
import Proveedor from '@model/proveedores/proveedor.model';
import ClassMapperService from '@services/class-mapper.service';
import ComprasService from '@services/compras.service';
import ProveedoresService from '@services/proveedores.service';
import CustomPaginatorIntl from '@shared/custom-paginator-intl.class';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';
import { shallowEqual } from '@shared/utils';

@Component({
  selector: 'otpv-compras-pedidos-list',
  templateUrl: './compras-pedidos-list.component.html',
  styleUrls: ['./compras-pedidos-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FixedNumberPipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormFieldModule,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelect,
    MatLabel,
    MatOption,
    MatTableModule,
    MatTooltip,
    MatPaginatorModule,
    Field,
  ],
})
export default class ComprasPedidosListComponent {
  private readonly cs: ComprasService = inject(ComprasService);
  private readonly ps: ProveedoresService = inject(ProveedoresService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly router: Router = inject(Router);

  numPorPag: number = 10;
  pedidosGuardados: Pedido[] = [];
  pageGuardadosIndex: number = 0;
  guardadosPag: number = 1;
  guardadosPags: number = 0;
  pedidosRecepcionados: Pedido[] = [];
  pageRecepcionadosIndex: number = 0;
  recepcionadosPag: number = 1;
  recepcionadosPags: number = 0;

  proveedores: Proveedor[] = this.ps.proveedores();

  GUARDADOS_INIT: PedidosFilterInterface = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: -1,
    albaran: '',
    importeDesde: 0,
    importeHasta: 0,
    pagina: 1,
    num: 10,
  };
  showGuardadosFilters: WritableSignal<boolean> = signal<boolean>(false);
  guardadosModel: WritableSignal<PedidosFilterInterface> = signal<PedidosFilterInterface>({
    ...this.GUARDADOS_INIT,
  });
  guardadosRangoDesde: Date | null = null;
  guardadosRangoHasta: Date | null = null;

  formGuardados = form(this.guardadosModel, (p) => {
    min(p.importeDesde, 0);
    min(p.importeHasta, 0);

    // deshabilitar campos en carga (si quieres)
    disabled(p.fechaDesde, () => this.loadingGuardados());
    disabled(p.fechaHasta, () => this.loadingGuardados());
    disabled(p.idProveedor, () => this.loadingGuardados());
    disabled(p.albaran, () => this.loadingGuardados());
    disabled(p.importeDesde, () => this.loadingGuardados());
    disabled(p.importeHasta, () => this.loadingGuardados());
  });

  RECEPCIONADOS_INIT: PedidosFilterInterface = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: -1,
    albaran: '',
    importeDesde: 0,
    importeHasta: 0,
    pagina: 1,
    num: 10,
  };
  showRecepcionadosFilters: WritableSignal<boolean> = signal<boolean>(false);
  recepcionadosModel: WritableSignal<PedidosFilterInterface> = signal<PedidosFilterInterface>({
    ...this.RECEPCIONADOS_INIT,
  });
  recepcionadosRangoDesde: Date | null = null;
  recepcionadosRangoHasta: Date | null = null;

  formRecepcionados = form(this.recepcionadosModel, (p) => {
    min(p.importeDesde, 0);
    min(p.importeHasta, 0);

    disabled(p.fechaDesde, () => this.loadingRecepcionados());
    disabled(p.fechaHasta, () => this.loadingRecepcionados());
    disabled(p.idProveedor, () => this.loadingRecepcionados());
    disabled(p.albaran, () => this.loadingRecepcionados());
    disabled(p.importeDesde, () => this.loadingRecepcionados());
    disabled(p.importeHasta, () => this.loadingRecepcionados());
  });

  loadingGuardados: WritableSignal<boolean> = signal(false);
  loadingRecepcionados: WritableSignal<boolean> = signal(false);

  isGuardadosValid: Signal<boolean> = computed(
    (): boolean =>
      !this.formGuardados.importeDesde().errors() && !this.formGuardados.importeHasta().errors()
  );
  isRecepcionadosValid: Signal<boolean> = computed(
    (): boolean =>
      !this.formRecepcionados.importeDesde().errors() &&
      !this.formRecepcionados.importeHasta().errors()
  );

  pedidosGuardadosDisplayedColumns: string[] = ['fechaPedido', 'proveedor', 'num', 'importe'];
  pedidosRecepcionadosDisplayedColumns: string[] = [
    'fechaRecepcionado',
    'fechaPedido',
    'fechaPago',
    'proveedor',
    'num',
    'importe',
    'iconos',
  ];

  pedidosGuardadosDataSource: MatTableDataSource<Pedido> = new MatTableDataSource<Pedido>();
  pedidosRecepcionadosDataSource: MatTableDataSource<Pedido> = new MatTableDataSource<Pedido>();

  load(): void {
    const filters: PedidosFilterInterface = {
      fechaDesde: '',
      fechaHasta: '',
      idProveedor: -1,
      albaran: '',
      importeDesde: 0,
      importeHasta: 0,
      pagina: 1,
      num: this.numPorPag,
    };
    this.cs.getAllPedidos(filters).subscribe((result: PedidosAllResult): void => {
      this.pedidosGuardados = this.cms.getPedidos(result.guardados);
      this.pedidosRecepcionados = this.cms.getPedidos(result.recepcionados);
      this.guardadosPags = result.guardadosPags * this.numPorPag;
      this.recepcionadosPags = result.recepcionadosPags * this.numPorPag;

      this.pedidosGuardadosDataSource.data = this.pedidosGuardados;
      this.pedidosRecepcionadosDataSource.data = this.pedidosRecepcionados;
    });
  }

  openGuardadosFilters(): void {
    this.showGuardadosFilters.update((value: boolean): boolean => !value);
  }

  openRecepcionadosFilters(): void {
    this.showRecepcionadosFilters.update((value: boolean): boolean => !value);
  }

  guardadosFiltered: Signal<boolean> = computed(
    (): boolean => !shallowEqual(this.guardadosModel(), this.GUARDADOS_INIT)
  );

  recepcionadosFiltered: Signal<boolean> = computed(
    (): boolean => !shallowEqual(this.recepcionadosModel(), this.RECEPCIONADOS_INIT)
  );

  quitarFiltrosGuardados(ev: MouseEvent): void {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.guardadosModel.set({ ...this.GUARDADOS_INIT });
  }

  filtrarGuardados(): void {
    if (!this.isGuardadosValid()) {
      return;
    }
    this.loadingGuardados.set(true);
    this.cs.getPedidosGuardados(this.guardadosModel()).subscribe((result: PedidosResult): void => {
      this.pedidosGuardadosDataSource.data = this.cms.getPedidos(result.list);
      this.guardadosPags = result.pags * this.guardadosModel().num;
      this.loadingGuardados.set(false);
    });
  }

  quitarFiltrosRecepcionados(ev: MouseEvent): void {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.recepcionadosModel.set({ ...this.RECEPCIONADOS_INIT });
  }

  filtrarRecepcionados(): void {
    if (!this.isRecepcionadosValid()) {
      return;
    }
    this.loadingRecepcionados.set(true);
    this.cs
      .getPedidosRecepcionados(this.recepcionadosModel())
      .subscribe((result: PedidosResult): void => {
        this.pedidosRecepcionadosDataSource.data = this.cms.getPedidos(result.list);
        this.recepcionadosPags = result.pags * this.recepcionadosModel().num;
        this.loadingGuardados.set(false);
      });
  }

  goToPedido(pedido: Pedido): void {
    this.router.navigate(['/compras/pedido', pedido.id]);
  }

  changePageGuardados(ev: PageEvent): void {
    this.pageGuardadosIndex = ev.pageIndex;
    this.guardadosModel.update((model: PedidosFilterInterface): PedidosFilterInterface => {
      model.pagina = ev.pageIndex + 1;
      model.num = ev.pageSize;
      return model;
    });
    this.filtrarGuardados();
  }

  changePageRecepcionados(ev: PageEvent): void {
    this.pageRecepcionadosIndex = ev.pageIndex;
    this.guardadosModel.update((model: PedidosFilterInterface): PedidosFilterInterface => {
      model.pagina = ev.pageIndex + 1;
      model.num = ev.pageSize;
      return model;
    });
    this.filtrarRecepcionados();
  }
}
