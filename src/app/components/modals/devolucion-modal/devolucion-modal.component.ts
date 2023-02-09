import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { DateValues } from "src/app/interfaces/interfaces";
import { DevolucionSelectedInterface } from "src/app/interfaces/venta.interface";
import { VentaHistorico } from "src/app/model/caja/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/caja/venta-linea-historico.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-devolucion-modal",
  templateUrl: "./devolucion-modal.component.html",
  styleUrls: ["./devolucion-modal.component.scss"],
})
export class DevolucionModalComponent implements OnInit {
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
    private dialog: DialogService,
    private customOverlayRef: CustomOverlayRef<
      null,
      { idVenta: number; list: DevolucionSelectedInterface[] }
    >
  ) {}

  ngOnInit(): void {
    if (this.customOverlayRef.data.list === null) {
      const data: DateValues = {
        modo: "id",
        fecha: null,
        id: this.customOverlayRef.data.idVenta,
        desde: null,
        hasta: null,
      };
      this.vs.getHistorico(data).subscribe((result) => {
        const list: VentaHistorico[] = this.cms.getHistoricoVentas(result.list);
        this.venta = list[0];
        this.devolucionDataSource.data = this.venta.lineas;
      });
    } else {
      this.continueDevolucion(
        this.customOverlayRef.data.idVenta,
        this.customOverlayRef.data.list
      );
    }
  }

  continueDevolucion(
    idVenta: number,
    list: DevolucionSelectedInterface[]
  ): void {
    const data: DateValues = {
      modo: "id",
      fecha: null,
      id: idVenta,
      desde: null,
      hasta: null,
    };
    this.vs.getHistorico(data).subscribe((result) => {
      this.selection.clear();
      const ventas: VentaHistorico[] = this.cms.getHistoricoVentas(result.list);
      this.venta = ventas[0];
      for (let item of list) {
        let ind: number = this.venta.lineas.findIndex(
          (x: VentaLineaHistorico): boolean => {
            return x.id === item.id;
          }
        );
        this.venta.lineas[ind].devolver = item.unidades;
        this.selection.select(this.venta.lineas[ind]);
      }
      this.devolucionDataSource.data = this.venta.lineas;
    });
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
      list.push({
        id: s.id,
        unidades: s.devolver * -1,
      });
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
      this.selection.clear();
      this.customOverlayRef.close(list);
    }
  }
}
