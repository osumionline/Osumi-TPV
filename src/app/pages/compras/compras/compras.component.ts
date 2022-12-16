import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { PedidosFilterInterface } from "src/app/interfaces/pedido.interface";
import { Pedido } from "src/app/model/pedido.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ComprasService } from "src/app/services/compras.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { CustomPaginatorIntl } from "src/app/shared/custom-paginator-intl.class";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
})
export class ComprasComponent implements OnInit, AfterViewInit {
  showGuardadosFilters: boolean = false;
  guardadosFilter: PedidosFilterInterface = {
    fechaDesde: null,
    fechaHasta: null,
    idProveedor: null,
    albaran: null,
    importeDesde: null,
    importeHasta: null,
    pagina: 1,
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
  };
  recepcionadosRangoDesde: Date = null;
  recepcionadosRangoHasta: Date = null;

  pedidosDisplayedColumns: string[] = [
    "fechaPedido",
    "proveedor",
    "numAlbaranFactura",
    "importe",
  ];

  pedidosGuardadosDataSource: MatTableDataSource<Pedido> =
    new MatTableDataSource<Pedido>();
  pedidosRecepcionadosDataSource: MatTableDataSource<Pedido> =
    new MatTableDataSource<Pedido>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public comprasService: ComprasService,
    public proveedoresService: ProveedoresService,
    private cms: ClassMapperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidosGuardadosDataSource.data = this.comprasService.pedidosGuardados;
    this.pedidosRecepcionadosDataSource.data =
      this.comprasService.pedidosRecepcionados;
  }

  ngAfterViewInit(): void {
    this.pedidosGuardadosDataSource.sort = this.sort;
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
  }

  filtrarGuardados(): void {
    this.guardadosFilter.fechaDesde = Utils.getDate(this.guardadosRangoDesde);
    this.guardadosFilter.fechaHasta = Utils.getDate(this.guardadosRangoHasta);
    this.comprasService
      .getPedidosGuardados(this.guardadosFilter)
      .subscribe((result) => {
        this.pedidosGuardadosDataSource.data = this.cms.getPedidos(result.list);
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
  }

  filtrarRecepcionados(): void {
    this.recepcionadosFilter.fechaDesde = Utils.getDate(
      this.recepcionadosRangoDesde
    );
    this.recepcionadosFilter.fechaHasta = Utils.getDate(
      this.recepcionadosRangoHasta
    );
    this.comprasService
      .getPedidosRecepcionados(this.recepcionadosFilter)
      .subscribe((result) => {
        this.pedidosRecepcionadosDataSource.data = this.cms.getPedidos(
          result.list
        );
      });
  }

  goToPedido(pedido: Pedido): void {
    this.router.navigate(["/compras/pedido", pedido.id]);
  }
}
