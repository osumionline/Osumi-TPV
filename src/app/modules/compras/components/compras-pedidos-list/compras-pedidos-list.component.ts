import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
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
import { getDate } from '@osumi/tools';
import ClassMapperService from '@services/class-mapper.service';
import ComprasService from '@services/compras.service';
import ProveedoresService from '@services/proveedores.service';
import CustomPaginatorIntl from '@shared/custom-paginator-intl.class';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

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
  ],
})
export default class ComprasPedidosListComponent {
  public comprasService: ComprasService = inject(ComprasService);
  public proveedoresService: ProveedoresService = inject(ProveedoresService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private router: Router = inject(Router);

  numPorPag: number = 10;
  pedidosGuardados: Pedido[] = [];
  pageGuardadosIndex: number = 0;
  guardadosPag: number = 1;
  guardadosPags: number = 0;
  pedidosRecepcionados: Pedido[] = [];
  pageRecepcionadosIndex: number = 0;
  recepcionadosPag: number = 1;
  recepcionadosPags: number = 0;

  showGuardadosFilters: boolean = false;
  guardadosFilter: PedidosFilterInterface = {
    fechaDesde: null,
    fechaHasta: null,
    idProveedor: null,
    albaran: null,
    importeDesde: null,
    importeHasta: null,
    pagina: 1,
    num: 10,
  };
  guardadosRangoDesde: Date = null;
  guardadosRangoHasta: Date = null;

  formGuardados: FormGroup = new FormGroup({
    fechaDesde: new FormControl<Date>(null),
    fechaHasta: new FormControl<Date>(null),
    idProveedor: new FormControl<number>(null),
    albaran: new FormControl<string>(null),
    importeDesde: new FormControl<number>(null),
    importeHasta: new FormControl<number>(null),
  });

  showRecepcionadosFilters: boolean = false;
  recepcionadosFilter: PedidosFilterInterface = {
    fechaDesde: null,
    fechaHasta: null,
    idProveedor: null,
    albaran: null,
    importeDesde: null,
    importeHasta: null,
    pagina: 1,
    num: 10,
  };
  recepcionadosRangoDesde: Date = null;
  recepcionadosRangoHasta: Date = null;

  formRecepcionados: FormGroup = new FormGroup({
    fechaDesde: new FormControl<Date>(null),
    fechaHasta: new FormControl<Date>(null),
    idProveedor: new FormControl<number>(null),
    albaran: new FormControl<string>(null),
    importeDesde: new FormControl<number>(null),
    importeHasta: new FormControl<number>(null),
  });

  pedidosGuardadosDisplayedColumns: string[] = [
    'fechaPedido',
    'proveedor',
    'num',
    'importe',
  ];
  pedidosRecepcionadosDisplayedColumns: string[] = [
    'fechaRecepcionado',
    'fechaPedido',
    'fechaPago',
    'proveedor',
    'num',
    'importe',
    'iconos',
  ];

  pedidosGuardadosDataSource: MatTableDataSource<Pedido> =
    new MatTableDataSource<Pedido>();
  pedidosRecepcionadosDataSource: MatTableDataSource<Pedido> =
    new MatTableDataSource<Pedido>();

  load(): void {
    const filters: PedidosFilterInterface = {
      fechaDesde: null,
      fechaHasta: null,
      idProveedor: null,
      albaran: null,
      importeDesde: null,
      importeHasta: null,
      pagina: 1,
      num: this.numPorPag,
    };
    this.comprasService
      .getAllPedidos(filters)
      .subscribe((result: PedidosAllResult): void => {
        this.pedidosGuardados = this.cms.getPedidos(result.guardados);
        this.pedidosRecepcionados = this.cms.getPedidos(result.recepcionados);
        this.guardadosPags = result.guardadosPags * this.numPorPag;
        this.recepcionadosPags = result.recepcionadosPags * this.numPorPag;

        this.pedidosGuardadosDataSource.data = this.pedidosGuardados;
        this.pedidosRecepcionadosDataSource.data = this.pedidosRecepcionados;
      });
  }

  openGuardadosFilters(): void {
    this.showGuardadosFilters = !this.showGuardadosFilters;
  }

  openRecepcionadosFilters(): void {
    this.showRecepcionadosFilters = !this.showRecepcionadosFilters;
  }

  get guardadosFiltered(): boolean {
    return this.formGuardados.dirty;
  }

  quitarFiltrosGuardados(ev: MouseEvent): void {
    ev && ev.preventDefault();
    ev && ev.stopPropagation();
    this.formGuardados.reset();
    this.guardadosFilter.pagina = 1;
  }

  filtrarGuardados(): void {
    this.guardadosFilter.fechaDesde = getDate(
      this.formGuardados.get('fechaDesde').value
    );
    this.guardadosFilter.fechaHasta = getDate(
      this.formGuardados.get('fechaHasta').value
    );
    this.guardadosFilter.idProveedor =
      this.formGuardados.get('idProveedor').value;
    this.guardadosFilter.albaran = this.formGuardados.get('albaran').value;
    this.guardadosFilter.importeDesde =
      this.formGuardados.get('importeDesde').value;
    this.guardadosFilter.importeHasta =
      this.formGuardados.get('importeHasta').value;
    this.comprasService
      .getPedidosGuardados(this.guardadosFilter)
      .subscribe((result: PedidosResult): void => {
        this.pedidosGuardadosDataSource.data = this.cms.getPedidos(result.list);
        this.guardadosPags = result.pags * this.guardadosFilter.num;
      });
  }

  get recepcionadosFiltered(): boolean {
    return this.formRecepcionados.dirty;
  }

  quitarFiltrosRecepcionados(ev: MouseEvent): void {
    ev && ev.preventDefault();
    ev && ev.stopPropagation();
    this.formRecepcionados.reset();
    this.recepcionadosFilter.pagina = 1;
  }

  filtrarRecepcionados(): void {
    this.recepcionadosFilter.fechaDesde = getDate(
      this.formRecepcionados.get('fechaDesde').value
    );
    this.recepcionadosFilter.fechaHasta = getDate(
      this.formRecepcionados.get('fechaHasta').value
    );
    this.recepcionadosFilter.idProveedor =
      this.formRecepcionados.get('idProveedor').value;
    this.recepcionadosFilter.albaran =
      this.formRecepcionados.get('albaran').value;
    this.recepcionadosFilter.importeDesde =
      this.formRecepcionados.get('importeDesde').value;
    this.recepcionadosFilter.importeHasta =
      this.formRecepcionados.get('importeHasta').value;
    this.comprasService
      .getPedidosRecepcionados(this.recepcionadosFilter)
      .subscribe((result: PedidosResult): void => {
        this.pedidosRecepcionadosDataSource.data = this.cms.getPedidos(
          result.list
        );
        this.recepcionadosPags = result.pags * this.recepcionadosFilter.num;
      });
  }

  goToPedido(pedido: Pedido): void {
    this.router.navigate(['/compras/pedido', pedido.id]);
  }

  changePageGuardados(ev: PageEvent): void {
    this.pageGuardadosIndex = ev.pageIndex;
    this.guardadosFilter.pagina = ev.pageIndex + 1;
    this.guardadosFilter.num = ev.pageSize;
    this.filtrarGuardados();
  }

  changePageRecepcionados(ev: PageEvent): void {
    this.pageRecepcionadosIndex = ev.pageIndex;
    this.recepcionadosFilter.pagina = ev.pageIndex + 1;
    this.recepcionadosFilter.num = ev.pageSize;
    this.filtrarRecepcionados();
  }
}
