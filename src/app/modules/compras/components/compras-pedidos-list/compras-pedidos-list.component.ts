import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterModule } from "@angular/router";
import { getDate } from "@osumi/tools";
import {
  PedidosAllResult,
  PedidosFilterInterface,
  PedidosResult,
} from "src/app/interfaces/pedido.interface";
import { Pedido } from "src/app/model/compras/pedido.model";
import { CustomPaginatorIntl } from "src/app/modules/shared/custom-paginator-intl.class";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ComprasService } from "src/app/services/compras.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  standalone: true,
  selector: "otpv-compras-pedidos-list",
  templateUrl: "./compras-pedidos-list.component.html",
  styleUrls: ["./compras-pedidos-list.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FixedNumberPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
})
export class ComprasPedidosListComponent {
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

  pedidosGuardadosDisplayedColumns: string[] = [
    "fechaPedido",
    "proveedor",
    "num",
    "importe",
  ];
  pedidosRecepcionadosDisplayedColumns: string[] = [
    "fechaRecepcionado",
    "fechaPedido",
    "fechaPago",
    "proveedor",
    "num",
    "importe",
    "iconos",
  ];

  pedidosGuardadosDataSource: MatTableDataSource<Pedido> =
    new MatTableDataSource<Pedido>();
  pedidosRecepcionadosDataSource: MatTableDataSource<Pedido> =
    new MatTableDataSource<Pedido>();

  constructor(
    public comprasService: ComprasService,
    public proveedoresService: ProveedoresService,
    private cms: ClassMapperService,
    private router: Router
  ) {}

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
    return (
      this.guardadosRangoDesde !== null ||
      this.guardadosRangoHasta !== null ||
      this.guardadosFilter.fechaDesde !== null ||
      this.guardadosFilter.fechaHasta !== null ||
      this.guardadosFilter.idProveedor !== null ||
      this.guardadosFilter.albaran !== null ||
      this.guardadosFilter.importeDesde !== null ||
      this.guardadosFilter.importeHasta !== null
    );
  }

  quitarFiltrosGuardados(): void {
    this.guardadosRangoDesde = null;
    this.guardadosRangoHasta = null;
    this.guardadosFilter.fechaDesde = null;
    this.guardadosFilter.fechaHasta = null;
    this.guardadosFilter.idProveedor = null;
    this.guardadosFilter.albaran = null;
    this.guardadosFilter.importeDesde = null;
    this.guardadosFilter.importeHasta = null;
    this.guardadosFilter.pagina = 1;
  }

  filtrarGuardados(): void {
    this.guardadosFilter.fechaDesde = getDate(this.guardadosRangoDesde);
    this.guardadosFilter.fechaHasta = getDate(this.guardadosRangoHasta);
    this.comprasService
      .getPedidosGuardados(this.guardadosFilter)
      .subscribe((result: PedidosResult): void => {
        this.pedidosGuardadosDataSource.data = this.cms.getPedidos(result.list);
        this.guardadosPags = result.pags * this.guardadosFilter.num;
      });
  }

  get recepcionadosFiltered(): boolean {
    return (
      this.recepcionadosRangoDesde !== null ||
      this.recepcionadosRangoHasta !== null ||
      this.recepcionadosFilter.fechaDesde !== null ||
      this.recepcionadosFilter.fechaHasta !== null ||
      this.recepcionadosFilter.idProveedor !== null ||
      this.recepcionadosFilter.albaran !== null ||
      this.recepcionadosFilter.importeDesde !== null ||
      this.recepcionadosFilter.importeHasta !== null
    );
  }

  quitarFiltrosRecepcionados(): void {
    this.recepcionadosRangoDesde = null;
    this.recepcionadosRangoHasta = null;
    this.recepcionadosFilter.fechaDesde = null;
    this.recepcionadosFilter.fechaHasta = null;
    this.recepcionadosFilter.idProveedor = null;
    this.recepcionadosFilter.albaran = null;
    this.recepcionadosFilter.importeDesde = null;
    this.recepcionadosFilter.importeHasta = null;
    this.recepcionadosFilter.pagina = 1;
  }

  filtrarRecepcionados(): void {
    this.recepcionadosFilter.fechaDesde = getDate(this.recepcionadosRangoDesde);
    this.recepcionadosFilter.fechaHasta = getDate(this.recepcionadosRangoHasta);
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
    this.router.navigate(["/compras/pedido", pedido.id]);
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
