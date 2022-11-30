import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PedidosFilterInterface } from "src/app/interfaces/interfaces";
import { Pedido } from "src/app/model/pedido.model";
import { ComprasService } from "src/app/services/compras.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.scss"],
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
    public proveedoresService: ProveedoresService
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
}
