import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { HistoricoVentasResult } from "src/app/interfaces/caja.interface";
import { DateValues } from "src/app/interfaces/interfaces";
import { DevolucionSelectedInterface } from "src/app/interfaces/venta.interface";
import { VentaHistorico } from "src/app/model/caja/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/caja/venta-linea-historico.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  standalone: true,
  selector: "otpv-devolucion-modal",
  templateUrl: "./devolucion-modal.component.html",
  styleUrls: ["./devolucion-modal.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    FixedNumberPipe,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
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
      this.vs
        .getHistorico(data)
        .subscribe((result: HistoricoVentasResult): void => {
          const list: VentaHistorico[] = this.cms.getHistoricoVentas(
            result.list
          );
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
    this.vs
      .getHistorico(data)
      .subscribe((result: HistoricoVentasResult): void => {
        this.selection.clear();
        const ventas: VentaHistorico[] = this.cms.getHistoricoVentas(
          result.list
        );
        this.venta = ventas[0];
        for (const item of list) {
          const ind: number = this.venta.lineas.findIndex(
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
      : this.devolucionDataSource.data.forEach(
          (row: VentaLineaHistorico): boolean | void =>
            this.selection.select(row)
        );
  }

  continuar(): void {
    const list: DevolucionSelectedInterface[] = [];
    this.selection.selected.forEach((s: VentaLineaHistorico): void => {
      list.push({
        id: s.id,
        unidades: s.devolver * -1,
      });
    });
    if (list.length === 0) {
      this.dialog.alert({
        title: "Error",
        content:
          "¡Atención! No has elegido ningún artículo para realizar su devolución.",
        ok: "Continuar",
      });
    } else {
      this.selection.clear();
      this.customOverlayRef.close(list);
    }
  }
}
