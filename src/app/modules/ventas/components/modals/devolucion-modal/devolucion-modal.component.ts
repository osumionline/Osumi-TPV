import { SelectionModel } from '@angular/cdk/collections';
import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
  OutputEmitterRef,
  inject,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HistoricoVentasResult } from '@interfaces/caja.interface';
import { DateValues } from '@interfaces/interfaces';
import { DevolucionSelectedInterface } from '@interfaces/venta.interface';
import VentaHistorico from '@model/caja/venta-historico.model';
import VentaLineaHistorico from '@model/caja/venta-linea-historico.model';
import { CustomOverlayRef } from '@model/tpv/custom-overlay-ref.model';
import ClassMapperService from '@services/class-mapper.service';
import DialogService from '@services/dialog.service';
import VentasService from '@services/ventas.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  standalone: true,
  selector: 'otpv-devolucion-modal',
  templateUrl: './devolucion-modal.component.html',
  styleUrls: ['./devolucion-modal.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    FixedNumberPipe,
    MatTableModule,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatButton,
  ],
})
export default class DevolucionModalComponent implements OnInit {
  private vs: VentasService = inject(VentasService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private customOverlayRef: CustomOverlayRef<
    null,
    { idVenta: number; list: DevolucionSelectedInterface[] }
  > = inject(CustomOverlayRef);

  venta: VentaHistorico = new VentaHistorico();
  devolucionDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();
  devolucionDisplayedColumns: string[] = [
    'select',
    'articulo',
    'unidades',
    'pvp',
    'descuento',
    'importe',
  ];
  selection: SelectionModel<VentaLineaHistorico> =
    new SelectionModel<VentaLineaHistorico>(true, []);
  continueEvent: OutputEmitterRef<DevolucionSelectedInterface[]> =
    output<DevolucionSelectedInterface[]>();

  ngOnInit(): void {
    if (this.customOverlayRef.data.list === null) {
      const data: DateValues = {
        modo: 'id',
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
      modo: 'id',
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
        title: 'Error',
        content:
          '¡Atención! No has elegido ningún artículo para realizar su devolución.',
        ok: 'Continuar',
      });
    } else {
      this.selection.clear();
      this.customOverlayRef.close(list);
    }
  }
}
