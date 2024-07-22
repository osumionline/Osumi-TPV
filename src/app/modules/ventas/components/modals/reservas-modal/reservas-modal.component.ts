import { SelectionModel } from '@angular/cdk/collections';
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReservasResult } from '@interfaces/cliente.interface';
import { StatusResult } from '@interfaces/interfaces';
import { CustomOverlayRef } from '@model/tpv/custom-overlay-ref.model';
import ReservaLinea from '@model/ventas/reserva-linea.model';
import Reserva from '@model/ventas/reserva.model';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import DialogService from '@services/dialog.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  standalone: true,
  selector: 'otpv-reservas-modal',
  templateUrl: './reservas-modal.component.html',
  styleUrls: ['./reservas-modal.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    MatTableModule,
    MatCheckbox,
    MatButton,
  ],
})
export default class ReservasModalComponent implements OnInit, AfterViewInit {
  private cs: ClientesService = inject(ClientesService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private customOverlayRef: CustomOverlayRef<null, {}> =
    inject(CustomOverlayRef);

  list: Reserva[] = [];
  reservaSelected: Reserva = null;

  reservasDisplayedColumns: string[] = [
    'select',
    'fecha',
    'cliente',
    'importe',
  ];
  reservasDataSource: MatTableDataSource<Reserva> =
    new MatTableDataSource<Reserva>();
  reservaSelectedDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'articulo',
    'unidades',
    'pvp',
    'descuento',
    'importe',
  ];
  reservaSelectedDataSource: MatTableDataSource<ReservaLinea> =
    new MatTableDataSource<ReservaLinea>();
  @ViewChild(MatSort) sort: MatSort;

  selection: SelectionModel<Reserva> = new SelectionModel<Reserva>(true, []);

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.cs.getReservas().subscribe((result: ReservasResult): void => {
      this.list = this.cms.getReservas(result.list);
      this.reservasDataSource.data = this.list;
    });
  }

  ngAfterViewInit(): void {
    this.reservasDataSource.sort = this.sort;
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.reservasDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.reservasDataSource.data.forEach((row: Reserva): boolean | void =>
          this.selection.select(row)
        );
  }

  selectReserva(ind: number): void {
    this.reservaSelected = this.list[ind];
    this.reservaSelectedDataSource.data = this.reservaSelected.lineas;
  }

  deleteReserva(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer borrar esta reserva?',
        ok: 'Continuar',
        cancel: 'Cancelar',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteVenta();
        }
      });
  }

  confirmDeleteVenta(): void {
    this.cs
      .deleteReserva(this.reservaSelected.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.reservaSelected = null;
          this.loadReservas();
        }
      });
  }

  cargarVenta(): void {
    this.customOverlayRef.close([this.reservaSelected]);
  }

  cargarVentas(): void {
    let idCliente: number = null;
    for (const reserva of this.selection.selected) {
      if (idCliente === null) {
        idCliente = reserva.idCliente;
      }
      if (idCliente !== reserva.idCliente) {
        this.dialog.alert({
          title: 'Error',
          content: 'Las reservas elegidas pertenecen a distintos clientes.',
          ok: 'Continuar',
        });
        return;
      }
    }
    this.customOverlayRef.close(this.selection.selected);
  }
}
