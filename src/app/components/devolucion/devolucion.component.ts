import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { DateValues } from "src/app/interfaces/interfaces";
import { DevolucionSelectedInterface } from "src/app/interfaces/venta.interface";
import { VentaHistorico } from "src/app/model/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/venta-linea-historico.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-devolucion",
  templateUrl: "./devolucion.component.html",
  styleUrls: ["./devolucion.component.scss"],
})
export class DevolucionComponent {
  muestraDevolucion: boolean = false;
  venta: VentaHistorico = new VentaHistorico();
  devolucionDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();
  devolucionDisplayedColumns: string[] = [
    "select",
    "articulo",
    "unidades",
    "pvp",
    "descuento",
    "importe",
  ];
  selection: SelectionModel<VentaLineaHistorico> =
    new SelectionModel<VentaLineaHistorico>(true, []);
  @Output() continueEvent: EventEmitter<DevolucionSelectedInterface[]> =
    new EventEmitter<DevolucionSelectedInterface[]>();

  constructor(
    private vs: VentasService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {}

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.muestraDevolucion) {
        this.cerrarDevolucion();
      }
    }
  }

  newDevolucion(idVenta: number): void {
    const data: DateValues = {
      modo: "id",
      fecha: null,
      id: idVenta,
      desde: null,
      hasta: null,
    };
    this.vs.getHistorico(data).subscribe((result) => {
      const list: VentaHistorico[] = this.cms.getHistoricoVentas(result.list);
      this.venta = list[0];
      this.devolucionDataSource.data = this.venta.lineas;
      this.muestraDevolucion = true;
    });
  }

  cerrarDevolucion(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraDevolucion = false;
    this.selection.clear();
    this.continueEvent.emit([]);
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.devolucionDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.devolucionDataSource.data.forEach((row) =>
          this.selection.select(row)
        );
  }

  continuar(): void {
    const list: DevolucionSelectedInterface[] = [];
    this.selection.selected.forEach((s) => {
      list.push({ localizador: s.localizador, unidades: s.devolver * -1 });
    });
    if (list.length === 0) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "¡Atención! No has elegido ningún artículo para realizar su devolución.",
          ok: "Continuar",
        })
        .subscribe((result) => {});
    } else {
      this.muestraDevolucion = false;
      this.selection.clear();
      this.continueEvent.emit(list);
    }
  }
}
